#!/usr/bin/env python3
"""
Batch Supabase Image Optimizer:
1. Downloads images from Supabase Storage.
2. Converts PNG/JPG images to high-efficiency WebP (quality 82, max 1600px dimension).
3. Uploads the WebP images with 1-year immutable cache header (max-age=31536000).
4. Verifies each uploaded WebP image.
5. Updates all product records in the Supabase database.
6. Deletes old unoptimized files to recover storage quota.
"""

import io
import json
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
import requests
from PIL import Image

SUPABASE_URL = "https://gbqusurpixzwhqrpnity.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdicXVzdXJwaXh6d2hxcnBuaXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2Njk2MTQsImV4cCI6MjEwMzI0NTYxNH0.8-wjpH4d4I4L48dlTcPkCBtAq-sao74U_wpYcRpkEco"
STORAGE_BUCKET = "product-images"
STORAGE_PREFIX = f"{SUPABASE_URL}/storage/v1/object/public/{STORAGE_BUCKET}/"

AUTH_HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
}

MANIFEST_PATH = Path("./scripts/image_optimization_manifest.json")
BACKUP_MANIFEST_PATH = Path("./scripts/image_optimization_manifest.backup.json")

def get_all_products():
    """Fetch all products from Supabase database."""
    url = f"{SUPABASE_URL}/rest/v1/products?select=id,name,image,gallery"
    resp = requests.get(url, headers=AUTH_HEADERS, timeout=30)
    resp.raise_for_status()
    return resp.json()

def optimize_single_image(old_url):
    """
    Downloads, compresses to WebP, and uploads to Supabase Storage with long cache.
    Returns (old_url, new_url, old_size, new_size, old_storage_path) or None on failure.
    """
    if not old_url.startswith(STORAGE_PREFIX):
        return None

    storage_path = old_url[len(STORAGE_PREFIX):]
    ext = storage_path.split(".")[-1].lower()

    # Skip videos or non-image media
    if ext in ("mp4", "webm", "mov"):
        return None

    # Determine new storage path
    base_path = storage_path.rsplit(".", 1)[0]
    new_storage_path = f"{base_path}.webp"
    new_url = f"{STORAGE_PREFIX}{new_storage_path}"

    try:
        # 1. Download original
        r = requests.get(old_url, timeout=25)
        if r.status_code != 200:
            print(f"  [WARN] Failed to download {old_url} (HTTP {r.status_code})")
            return None
        orig_data = r.content
        orig_size = len(orig_data)

        # If it's already WebP and smaller than 150KB, check if we need to re-upload for cache-control
        if ext == "webp" and orig_size < 150 * 1024:
            # Check cache control
            if r.headers.get("cache-control") == "public, max-age=31536000":
                return (old_url, old_url, orig_size, orig_size, None)

        # 2. Process image with Pillow
        img = Image.open(io.BytesIO(orig_data))

        # Handle RGBA / Alpha cleanly
        if img.mode in ("RGBA", "LA"):
            bg = Image.new("RGB", img.size, (255, 255, 255))
            bg.paste(img, mask=img.split()[-1])
            img = bg
        elif img.mode != "RGB":
            img = img.convert("RGB")

        # Downscale if exceeding max dimension (1600px is crystal clear for desktop retina zoom)
        w, h = img.size
        max_dim = 1600
        if max(w, h) > max_dim:
            if w > h:
                new_w = max_dim
                new_h = int(h * max_dim / w)
            else:
                new_h = max_dim
                new_w = int(w * max_dim / h)
            img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

        out_buf = io.BytesIO()
        img.save(out_buf, format="WEBP", quality=82, method=6)
        webp_bytes = out_buf.getvalue()
        new_size = len(webp_bytes)

        # 3. Upload WebP to Supabase Storage with 1-year immutable cache header
        upload_url = f"{SUPABASE_URL}/storage/v1/object/{STORAGE_BUCKET}/{new_storage_path}"
        upload_headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "cache-control": "max-age=31536000",
            "x-upsert": "true",
            "Content-Type": "image/webp"
        }
        up_resp = requests.post(upload_url, headers=upload_headers, data=webp_bytes, timeout=30)
        if up_resp.status_code != 200:
            print(f"  [ERROR] Upload failed for {new_storage_path}: HTTP {up_resp.status_code} {up_resp.text}")
            return None

        # 4. Verify fetch
        verify_resp = requests.get(new_url, timeout=15)
        if verify_resp.status_code != 200:
            print(f"  [ERROR] Verification failed for {new_url} (HTTP {verify_resp.status_code})")
            return None

        old_file_to_delete = storage_path if storage_path != new_storage_path else None
        return (old_url, new_url, orig_size, new_size, old_file_to_delete)

    except Exception as e:
        print(f"  [EXC] Exception optimizing {old_url}: {e}")
        return None

def main():
    print("=" * 70)
    print("🚀 SUPABASE IMAGE OPTIMIZER & CACHED EGRESS REDUCER")
    print("=" * 70)

    print("\n1. Fetching all products from Supabase DB...")
    products = get_all_products()
    print(f"   Found {len(products)} products in database.")

    # Collect unique image URLs
    all_supabase_urls = set()
    for p in products:
        img = p.get("image")
        if img and img.startswith(STORAGE_PREFIX):
            all_supabase_urls.add(img)
        for g in (p.get("gallery") or []):
            if isinstance(g, str) and g.startswith(STORAGE_PREFIX):
                all_supabase_urls.add(g)

    # Filter out videos
    image_urls = [u for u in all_supabase_urls if not u.lower().endswith((".mp4", ".webm", ".mov"))]
    print(f"   Collected {len(image_urls)} unique Supabase images to optimize.\n")

    print("2. Downloading, converting to WebP (quality 82, max 1600px), and uploading...")
    url_mapping = {}
    files_to_delete = []
    total_orig_bytes = 0
    total_new_bytes = 0
    success_count = 0
    skipped_count = 0

    with ThreadPoolExecutor(max_workers=6) as executor:
        futures = {executor.submit(optimize_single_image, url): url for url in image_urls}
        for future in as_completed(futures):
            res = future.result()
            if res:
                old_url, new_url, orig_size, new_size, old_path = res
                url_mapping[old_url] = new_url
                total_orig_bytes += orig_size
                total_new_bytes += new_size
                if old_path:
                    files_to_delete.append(old_path)
                
                savings_pct = 100 * (1 - (new_size / orig_size)) if orig_size > 0 else 0
                filename = old_url.split("/")[-1]
                print(f"   ✓ {filename} | {orig_size/1024:.1f}KB → {new_size/1024:.1f}KB (-{savings_pct:.1f}%)")
                success_count += 1
            else:
                skipped_count += 1

    print("\n" + "-" * 70)
    orig_mb = total_orig_bytes / (1024 * 1024)
    new_mb = total_new_bytes / (1024 * 1024)
    saved_mb = orig_mb - new_mb
    pct_saved = 100 * (1 - new_mb / orig_mb) if orig_mb > 0 else 0
    print(f"📊 SUMMARY OF IMAGE COMPRESSION:")
    print(f"   • Images optimized: {success_count} (Skipped/failed: {skipped_count})")
    print(f"   • Original total size: {orig_mb:.2f} MB")
    print(f"   • Optimized total size: {new_mb:.2f} MB")
    print(f"   • Bandwidth & Storage Saved: {saved_mb:.2f} MB ({pct_saved:.1f}% reduction!)")
    print("-" * 70)

    # 3. Update products in database
    print("\n3. Updating product records in Supabase DB with new WebP URLs...")
    updated_products_count = 0
    patch_headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }

    for p in products:
        pid = p["id"]
        orig_img = p.get("image")
        orig_gallery = p.get("gallery") or []

        new_img = url_mapping.get(orig_img, orig_img)
        new_gallery = [url_mapping.get(g, g) for g in orig_gallery]

        if new_img != orig_img or new_gallery != orig_gallery:
            patch_url = f"{SUPABASE_URL}/rest/v1/products?id=eq.{pid}"
            patch_resp = requests.patch(
                patch_url,
                headers=patch_headers,
                json={"image": new_img, "gallery": new_gallery},
                timeout=15
            )
            if patch_resp.status_code == 200 or patch_resp.status_code == 204:
                updated_products_count += 1
            else:
                print(f"   [WARN] Failed to update product '{pid}': {patch_resp.status_code} {patch_resp.text}")

    print(f"   ✓ Successfully updated {updated_products_count} product records in DB.")

    # 4. Save manifest
    manifest_data = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "total_images": len(image_urls),
        "optimized_images": success_count,
        "original_mb": round(orig_mb, 2),
        "optimized_mb": round(new_mb, 2),
        "savings_mb": round(saved_mb, 2),
        "savings_pct": round(pct_saved, 1),
        "updated_products": updated_products_count,
        "mapping": url_mapping
    }
    with open(MANIFEST_PATH, "w") as f:
        json.dump(manifest_data, f, indent=2)
    print(f"   ✓ Optimization manifest saved to: {MANIFEST_PATH}")

    # 5. Delete old oversized files from Supabase Storage
    if files_to_delete:
        print(f"\n4. Deleting {len(files_to_delete)} old unoptimized files from Supabase Storage...")
        del_url = f"{SUPABASE_URL}/storage/v1/object/{STORAGE_BUCKET}"
        del_headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json"
        }
        # Delete in chunks of 50
        deleted_count = 0
        chunk_size = 50
        for i in range(0, len(files_to_delete), chunk_size):
            chunk = files_to_delete[i:i + chunk_size]
            del_resp = requests.delete(del_url, headers=del_headers, json={"prefixes": chunk}, timeout=20)
            if del_resp.status_code == 200:
                deleted_count += len(chunk)
            else:
                print(f"   [WARN] Storage delete error for chunk: {del_resp.status_code} {del_resp.text}")

        print(f"   ✓ Deleted {deleted_count} obsolete original files from storage bucket.")

    print("\n" + "=" * 70)
    print("✅ COMPLETED IMAGE OPTIMIZATION")
    print("=" * 70)

if __name__ == "__main__":
    main()
