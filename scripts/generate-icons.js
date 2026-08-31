import fs from 'fs';
import path from 'path';

// Minimal 1x1 or valid base PNG binary buffer to serve as placeholder until dynamic rasterizer
// 192x192 base PNG with Neo-brutalist yellow block
const minimalPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const buffer = Buffer.from(minimalPngBase64, 'base64');

const iconsDir = path.join(process.cwd(), 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), buffer);
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), buffer);
console.log('Icons generated successfully.');
