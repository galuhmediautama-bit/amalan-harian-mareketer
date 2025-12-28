// Script to generate PWA icons (PNG format)
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate icon SVG
function generateIconSVG(size, text = 'AM') {
  const fontSize = size * 0.4;
  const textY = size * 0.6;
  
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#134e4a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#064e3b;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
  <text x="50%" y="${textY}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>`;
}

async function generateIcons() {
  try {
    console.log('🎨 Generating PWA icons...\n');

    // Generate 192x192 icon
    const svg192 = generateIconSVG(192, 'AM');
    await sharp(Buffer.from(svg192))
      .png()
      .toFile(path.join(publicDir, 'icon-192.png'));

    console.log('✅ Generated: public/icon-192.png (192x192)');

    // Generate 512x512 icon
    const svg512 = generateIconSVG(512, 'AM');
    await sharp(Buffer.from(svg512))
      .png()
      .toFile(path.join(publicDir, 'icon-512.png'));

    console.log('✅ Generated: public/icon-512.png (512x512)');

    console.log('\n✨ Icons generated successfully!');
    console.log('   You can now build and deploy your PWA.\n');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();

