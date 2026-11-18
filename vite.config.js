import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const r2DevPlugin = () => ({
  name: 'r2-dev-upload-handler',
  configureServer(server) {
    server.middlewares.use('/api/upload', (req, res, next) => {
      if (req.method !== 'POST') return next();
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const parsed = JSON.parse(body);
          const { filename, subFolder = 'product', contentType = 'image/webp', data } = parsed;
          const buffer = Buffer.from(data, 'base64');
          const key = `products/${subFolder}/${filename}`;

          const s3 = new S3Client({
            region: 'auto',
            endpoint: 'https://d9dc97dc47ccbb271e5b45f8733b0753.r2.cloudflarestorage.com',
            credentials: {
              accessKeyId: '2c62cd9ef08943d2e7b15c015c4b09d7',
              secretAccessKey: '7a7c0b1f229b490a6e5f28d3028e5b1e27034fe229678ed1179d828bfcbbc1d6',
            },
          });

          await s3.send(new PutObjectCommand({
            Bucket: 'abaya',
            Key: key,
            Body: buffer,
            ContentType: contentType,
            CacheControl: 'public, max-age=31536000',
          }));

          const publicUrl = `https://pub-3f84356b0199494d84c63d76fa342062.r2.dev/${key}`;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ url: publicUrl }));
        } catch (err) {
          console.error('[R2 Dev Upload] Error:', err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react(), r2DevPlugin()],
  server: {
    port: 3000,
    open: false
  }
})
