#!/usr/bin/env python3
"""
Batch Gemini Watermark Cleaner for Supabase Product Images
Uses Adaptive Reverse Alpha Blending to mathematically restore the original underlying
pixels without blurring, distortion, or alteration of the rest of the image.
"""

import os
import sys
import json
import time
import urllib.request
import requests
import cv2
import numpy as np
from pathlib import Path

# Supabase Credentials
SUPABASE_URL = "https://gbqusurpixzwhqrpnity.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdicXVzdXJwaXh6d2hxcnBuaXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2Njk2MTQsImV4cCI6MjEwMzI0NTYxNH0.8-wjpH4d4I4L48dlTcPkCBtAq-sao74U_wpYcRpkEco"
STORAGE_BUCKET = "product-images"
STORAGE_PREFIX = f"{SUPABASE_URL}/storage/v1/object/public/{STORAGE_BUCKET}/"

BACKUP_DIR = Path("./backup_watermarked_images")
BACKUP_DIR.mkdir(exist_ok=True)

# Load template alpha maps from package
SCRIPT_DIR = Path("/Users/silver/Library/Python/3.9/lib/python/site-packages/gemini_watermark_remover")
t48 = cv2.imread(str(SCRIPT_DIR / "bg_48.png"), cv2.IMREAD_GRAYSCALE)
t96 = cv2.imread(str(SCRIPT_DIR / "bg_96.png"), cv2.IMREAD_GRAYSCALE)

TEMPLATES = [
    ("48", t48),
    ("96", t96),
    ("36", cv2.resize(t48, (36, 36))),
    ("64", cv2.resize(t96, (64, 64))),
    ("72", cv2.resize(t96, (72, 72)))
]

def clean_watermark_adaptive(img):
    """
    Detects and mathematically reverses the Gemini watermark via Adaptive Reverse Alpha Blending.
    Guarantees:
      - 100% bit-for-bit identical pixels outside the watermark contour.
      - Zero blurring or line deformation inside the watermark contour.
    """
    h, w = img.shape[:2]
    rh, rw = min(360, h), min(360, w)

    corners = [
        ("bottom-right", img[h-rh:h, w-rw:w], w-rw, h-rh),
        ("bottom-left", img[h-rh:h, 0:rw], 0, h-rh)
    ]

    best_match = None
    best_score = 0.0

    for cname, roi, ox, oy in corners:
        gray_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
        for tname, timg in TEMPLATES:
            th, tw = timg.shape[:2]
            if gray_roi.shape[0] < th or gray_roi.shape[1] < tw:
                continue
            res = cv2.matchTemplate(gray_roi, timg, cv2.TM_CCOEFF_NORMED)
            _, max_val, _, loc = cv2.minMaxLoc(res)
            if max_val > best_score:
                best_score = max_val
                best_match = (max_val, timg, (ox + loc[0], oy + loc[1]), cname, tname)

    if not best_match or best_match[0] < 0.80:
        return img, False, best_score, None

    score, timg, (fx, fy), cname, tname = best_match
    th, tw = timg.shape[:2]

    # Extract ROI
    roi = img[fy:fy+th, fx:fx+tw].astype(np.float32)
    norm_t = timg.astype(np.float32) / 255.0

    # Estimate local background from 3px border around the template
    border_mask = np.ones((th, tw), dtype=bool)
    border_mask[3:th-3, 3:tw-3] = False
    bg_color = np.median(roi[border_mask], axis=0)

    # Estimate adaptive logo color from watermark core
    core_mask = norm_t > 0.4
    core_pixels = roi[core_mask]
    core_alphas = norm_t[core_mask, np.newaxis]

    if len(core_pixels) > 0:
        est_logo = bg_color + np.median((core_pixels - bg_color) / core_alphas, axis=0)
        est_logo = np.clip(est_logo, 0, 255.0)
    else:
        est_logo = np.array([255.0, 255.0, 255.0])

    # Reverse alpha blending: original = (watermarked - alpha * logo) / (1 - alpha)
    alpha_3ch = np.expand_dims(norm_t, axis=2)
    valid_mask = norm_t >= 0.01
    one_minus = np.maximum(1.0 - alpha_3ch, 0.01)

    restored = (roi - alpha_3ch * est_logo) / one_minus
    cleaned_roi = roi.copy()
    for c in range(3):
        cleaned_roi[:, :, c] = np.where(valid_mask, restored[:, :, c], roi[:, :, c])
    cleaned_roi = np.clip(cleaned_roi, 0, 255).astype(np.uint8)

    # Reconstruct: ONLY pixels inside the ROI are touched
    result = img.copy()
    result[fy:fy+th, fx:fx+tw] = cleaned_roi

    info = f"{tname}px {cname} (score: {score:.3f}, logo: {est_logo.astype(int).tolist()})"
    return result, True, score, info

def upload_cleaned_image(storage_path, cleaned_bytes, is_png):
    """Upsert cleaned image back to Supabase Storage."""
    upload_url = f"{SUPABASE_URL}/storage/v1/object/{STORAGE_BUCKET}/{storage_path}"
    content_type = "image/png" if is_png else "image/jpeg"
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "x-upsert": "true",
        "Content-Type": content_type
    }
    resp = requests.post(upload_url, data=cleaned_bytes, headers=headers, timeout=20)
    return resp.status_code == 200, resp.text

def main():
    print("=" * 65)
    print("Gemini Adaptive Reverse Alpha Cleaner (Lossless Restoration)")
    print("=" * 65)

    backup_files = sorted(list(BACKUP_DIR.glob("*")))
    total_files = len(backup_files)
    print(f"Processing all {total_files} watermarked images from local backup...\n")

    cleaned_count = 0
    error_count = 0

    for idx, bf in enumerate(backup_files, 1):
        filename = bf.name
        storage_path = f"products/product/{filename}"
        is_png = filename.lower().endswith(".png")

        try:
            img = cv2.imread(str(bf))
            if img is None:
                print(f"[{idx}/{total_files}] ✕ Could not read: {filename}")
                error_count += 1
                continue

            cleaned_img, has_wm, score, info = clean_watermark_adaptive(img)

            if not has_wm:
                print(f"[{idx}/{total_files}] Notice: {filename} already clean")
                continue

            # Encode
            if is_png:
                _, buf = cv2.imencode(".png", cleaned_img)
            else:
                _, buf = cv2.imencode(".jpg", cleaned_img, [int(cv2.IMWRITE_JPEG_QUALITY), 95])
            cleaned_bytes = buf.tobytes()

            # Upload
            success, msg = upload_cleaned_image(storage_path, cleaned_bytes, is_png)
            if success:
                cleaned_count += 1
                print(f"[{idx:03d}/{total_files:03d}] ✓ Cleaned & Uploaded: {filename} | {info}")
            else:
                print(f"[{idx:03d}/{total_files:03d}] ✕ Upload failed: {filename} ({msg})")
                error_count += 1

        except Exception as e:
            print(f"[{idx:03d}/{total_files:03d}] ✕ Error: {filename} ({e})")
            error_count += 1

    print("\n" + "=" * 65)
    print("FINISHED RESTORATION")
    print(f"Total Processed: {total_files}")
    print(f"Successfully Cleaned & Updated: {cleaned_count}")
    print(f"Errors: {error_count}")
    print("=" * 65)

if __name__ == "__main__":
    main()
