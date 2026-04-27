const sharp = require('sharp');
const fs = require('fs');

const inputPath = 'C:/Users/GABI/.gemini/antigravity/brain/bbc457fc-a6ec-49d4-a3fd-74d9e184913b/media__1777324830685.jpg';
const outputDir = 'e:/Mon_1ere_Idee_SaaS/MANNE RENT SaaS/ANTIGRAVITY MANNE RENT/manne-rent-admin/public/icons';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  await sharp(inputPath)
    .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .toFormat('png')
    .toFile(outputDir + '/admin-icon-192.png');
    
  await sharp(inputPath)
    .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .toFormat('png')
    .toFile(outputDir + '/admin-icon-512.png');
    
  console.log('New icons from JPG successfully updated');
}

generateIcons().catch(console.error);
