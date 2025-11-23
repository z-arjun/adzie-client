const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create canvas
const canvas = createCanvas(1024, 1024);
const ctx = canvas.getContext('2d');

// Purple background
ctx.fillStyle = '#6200EE';
ctx.fillRect(0, 0, 1024, 1024);

// White text
ctx.fillStyle = '#FFFFFF';
ctx.font = 'bold 600px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('adzie', 512, 512);

// Save as PNG
const buffer = canvas.toBuffer('image/png');
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
}
fs.writeFileSync(path.join(assetsDir, 'icon.png'), buffer);
console.log('Icon created successfully at assets/icon.png');
