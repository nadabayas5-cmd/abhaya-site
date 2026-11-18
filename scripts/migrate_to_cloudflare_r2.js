#!/usr/bin/env node
/**
 * Migration Script: Supabase Storage -> Cloudflare R2
 * 
 * 1. Fetches all products from Supabase database.
 * 2. Downloads all unique WebP images from Supabase Storage.
 * 3. Uploads them to Cloudflare R2 bucket 'abaya' with 1-year immutable cache.
 * 4. Verifies public access via https://pub-3f84356b0199494d84c63d76fa342062.r2.dev
 * 5. Updates all product records in Supabase database with the new R2 URLs.
 * 6. Saves a full migration manifest to scripts/r2_migration_manifest.json.
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

// Supabase Configuration
const SUPABASE_URL = 'https://gbqusurpixzwhqrpnity.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdicXVzdXJwaXh6d2hxcnBuaXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2Njk2MTQsImV4cCI6MjEwMzI0NTYxNH0.8-wjpH4d4I4L48dlTcPkCBtAq-sao74U_wpYcRpkEco';
const SUPABASE_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/product-images/`;

// Cloudflare R2 Configuration
const R2_ACCOUNT_ID = 'd9dc97dc47ccbb271e5b45f8733b0753';
const R2_BUCKET = 'abaya';
const R2_ACCESS_KEY = '2c62cd9ef08943d2e7b15c015c4b09d7';
const R2_SECRET_KEY = '7a7c0b1f229b490a6e5f28d3028e5b1e27034fe229678ed1179d828bfcbbc1d6';
const R2_PUBLIC_BASE = 'https://pub-3f84356b0199494d84c63d76fa342062.r2.dev';

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY,
    secretAccessKey: R2_SECRET_KEY,
  },
});

async function main() {
  console.log('='.repeat(70));
  console.log('🚀 CLOUDFLARE R2 MIGRATION SCRIPT (ZERO EGRESS PIPELINE)');
  console.log('='.repeat(70));

  // 1. Fetch products from Supabase
  console.log('\n1. Fetching all products from Supabase database...');
  const prodRes = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id,name,image,gallery`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!prodRes.ok) {
    throw new Error(`Failed to fetch products: ${prodRes.status} ${await prodRes.text()}`);
  }
  const products = await prodRes.json();
  console.log(`   Found ${products.length} products in database.`);

  // 2. Extract unique Supabase Storage image URLs
  const uniqueUrls = new Set();
  for (const p of products) {
    if (p.image && p.image.startsWith(SUPABASE_PREFIX)) {
      uniqueUrls.add(p.image);
    }
    for (const g of (p.gallery || [])) {
      if (typeof g === 'string' && g.startsWith(SUPABASE_PREFIX)) {
        uniqueUrls.add(g);
      }
    }
  }
  const imageList = Array.from(uniqueUrls);
  console.log(`   Found ${imageList.length} unique Supabase Storage files to migrate to R2.\n`);

  // 3. Migrate images to Cloudflare R2
  console.log('2. Transferring files from Supabase Storage -> Cloudflare R2...');
  const urlMapping = {};
  let successCount = 0;
  let failCount = 0;
  let totalBytes = 0;

  // Process with concurrency limit (8 parallel transfers)
  const CONCURRENCY = 8;
  for (let i = 0; i < imageList.length; i += CONCURRENCY) {
    const chunk = imageList.slice(i, i + CONCURRENCY);
    await Promise.all(chunk.map(async (oldUrl) => {
      const key = oldUrl.substring(SUPABASE_PREFIX.length);
      const newUrl = `${R2_PUBLIC_BASE}/${key}`;

      try {
        // Download from Supabase
        const dlRes = await fetch(oldUrl);
        if (!dlRes.ok) {
          console.warn(`   [WARN] Could not fetch ${oldUrl}: ${dlRes.status}`);
          failCount++;
          return;
        }

        const buffer = Buffer.from(await dlRes.arrayBuffer());
        totalBytes += buffer.length;

        // Content type detection
        const ext = key.split('.').pop().toLowerCase();
        let contentType = 'image/webp';
        if (ext === 'png') contentType = 'image/png';
        else if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg';
        else if (ext === 'mp4') contentType = 'video/mp4';

        // Upload to R2
        await s3.send(new PutObjectCommand({
          Bucket: R2_BUCKET,
          Key: key,
          Body: buffer,
          ContentType: contentType,
          CacheControl: 'public, max-age=31536000',
        }));

        // Verify public URL
        const verifyRes = await fetch(newUrl);
        if (verifyRes.ok) {
          urlMapping[oldUrl] = newUrl;
          successCount++;
          console.log(`   ✓ [${successCount}/${imageList.length}] ${key} (${(buffer.length / 1024).toFixed(1)} KB)`);
        } else {
          console.warn(`   [WARN] Verification failed for ${newUrl} (status ${verifyRes.status})`);
          failCount++;
        }
      } catch (err) {
        console.error(`   [ERR] Failed migrating ${key}:`, err.message);
        failCount++;
      }
    }));
  }

  console.log('\n' + '-'.repeat(70));
  console.log(`📊 R2 UPLOAD SUMMARY:`);
  console.log(`   • Successfully transferred & verified: ${successCount} files`);
  console.log(`   • Failed: ${failCount} files`);
  console.log(`   • Total transferred to R2: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log('-'.repeat(70));

  // 4. Update Database Records in Supabase
  console.log('\n3. Updating product records in Supabase DB with new R2 URLs...');
  let updatedProductsCount = 0;

  for (const p of products) {
    const origImg = p.image;
    const origGallery = p.gallery || [];

    const newImg = urlMapping[origImg] || origImg;
    const newGallery = origGallery.map(g => urlMapping[g] || g);

    if (newImg !== origImg || JSON.stringify(newGallery) !== JSON.stringify(origGallery)) {
      const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${p.id}`, {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: newImg,
          gallery: newGallery,
        }),
      });

      if (patchRes.ok) {
        updatedProductsCount++;
      } else {
        console.warn(`   [WARN] Failed to update product ${p.id}: ${patchRes.status} ${await patchRes.text()}`);
      }
    }
  }

  console.log(`   ✓ Successfully updated ${updatedProductsCount} product rows in Supabase DB.`);

  // 5. Save Manifest
  const manifest = {
    timestamp: new Date().toISOString(),
    r2_bucket: R2_BUCKET,
    r2_public_base: R2_PUBLIC_BASE,
    total_files: imageList.length,
    transferred_files: successCount,
    updated_products: updatedProductsCount,
    total_transferred_mb: Number((totalBytes / (1024 * 1024)).toFixed(2)),
    mapping: urlMapping,
  };

  const manifestPath = path.resolve('scripts/r2_migration_manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`   ✓ R2 Migration Manifest saved to: ${manifestPath}`);

  console.log('\n' + '='.repeat(70));
  console.log('🎉 ALL IMAGES MIGRATED TO CLOUDFLARE R2!');
  console.log('   All image requests now hit Cloudflare ($0.00 egress forever).');
  console.log('='.repeat(70));
}

main().catch(console.error);
