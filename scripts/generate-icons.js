// Script to generate PWA icons
const fs = require('fs');
const path = require('path');

// Simple SVG icon generator
function generateIcon(size, text = 'AM') {
  const fontSize = size * 0.4;
  const textY = size * 0.6;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
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

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate SVG icons
const icon192 = generateIcon(192, 'AM');
const icon512 = generateIcon(512, 'AM');

// Save SVG files
fs.writeFileSync(path.join(publicDir, 'icon-192.svg'), icon192);
fs.writeFileSync(path.join(publicDir, 'icon-512.svg'), icon512);

console.log('✅ SVG icons generated:');
console.log('  - public/icon-192.svg');
console.log('  - public/icon-512.svg');
console.log('');
console.log('⚠️  Note: PWA requires PNG format. Converting SVG to PNG...');
console.log('   You can use online tools like:');
console.log('   - https://cloudconvert.com/svg-to-png');
console.log('   - https://convertio.co/svg-png/');
console.log('');
console.log('   Or install sharp and run: npm run generate-icons:png');

