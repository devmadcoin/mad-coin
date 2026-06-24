const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function compressImages(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await compressImages(fullPath);
    } else if (/\.(png|jpg|jpeg)$/i.test(entry.name)) {
      const stats = fs.statSync(fullPath);
      if (stats.size > 400 * 1024) { // > 400KB
        try {
          const ext = path.extname(entry.name).toLowerCase();
          const pipeline = sharp(fullPath);
          
          // Resize if over 1200px wide
          const metadata = await pipeline.metadata();
          if (metadata.width > 1200) {
            pipeline.resize(1200, null, { withoutEnlargement: true });
          }
          
          // Compress based on format
          if (ext === '.png') {
            await pipeline
              .png({ quality: 70, compressionLevel: 9 })
              .toFile(fullPath + '.tmp');
          } else {
            await pipeline
              .jpeg({ quality: 75, progressive: true })
              .toFile(fullPath + '.tmp');
          }
          
          const oldSize = stats.size;
          const newSize = fs.statSync(fullPath + '.tmp').size;
          
          if (newSize < oldSize) {
            fs.renameSync(fullPath + '.tmp', fullPath);
            console.log(`✓ ${fullPath} (${(oldSize/1024/1024).toFixed(2)}MB → ${(newSize/1024/1024).toFixed(2)}MB)`);
          } else {
            fs.unlinkSync(fullPath + '.tmp');
            console.log(`⊘ ${fullPath} (no savings)`);
          }
        } catch (err) {
          console.error(`✗ ${fullPath}: ${err.message}`);
        }
      }
    }
  }
}

compressImages('./public').then(() => {
  console.log('\nDone!');
});
