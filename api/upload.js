import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || 'd9dc97dc47ccbb271e5b45f8733b0753';
const R2_BUCKET = process.env.R2_BUCKET || 'abaya';
const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY_ID || '2c62cd9ef08943d2e7b15c015c4b09d7';
const R2_SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY || '7a7c0b1f229b490a6e5f28d3028e5b1e27034fe229678ed1179d828bfcbbc1d6';
const R2_PUBLIC_BASE = (process.env.R2_PUBLIC_BASE || 'https://pub-3f84356b0199494d84c63d76fa342062.r2.dev').replace(/\/$/, '');

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY,
    secretAccessKey: R2_SECRET_KEY,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { filename, subFolder = 'product', contentType = 'image/webp', data } = body || {};

    if (!data || !filename) {
      return res.status(400).json({ error: 'Missing data or filename' });
    }

    const buffer = Buffer.from(data, 'base64');
    const key = `products/${subFolder}/${filename}`;

    await s3.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000',
    }));

    const publicUrl = `${R2_PUBLIC_BASE}/${key}`;
    return res.status(200).json({ url: publicUrl });
  } catch (err) {
    console.error('R2 upload error:', err);
    return res.status(500).json({ error: err.message || 'Error uploading to Cloudflare R2' });
  }
}
