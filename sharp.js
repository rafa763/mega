// let function = async () => {
let sharp = require('sharp');
const uploadFile = require('./s3');

sharp('DE.png')
    .resize({
        width: 90,
        height: 90,
        fit: sharp.fit.cover,
        withoutReduction: true
    })
//   .flatten( { background: '#ff6600' } )
    .sharpen()
    .withMetadata()
    .webp( { quality: 100 } )
    .toFile('n.png')

function toU(data){
sharp('xxx.jpeg')
  .resize(300)
  .flatten( { background: '#ff6600' } )
  .composite([{ input: 'n.png', gravity: 'southeast' }])
  .sharpen()
  .withMetadata()
  .webp( { quality: 90 } )
//   .toFile('combineed.png')
    .toBuffer()
  .then(data => {
    // outputBuffer contains upside down, 300px wide, alpha channel flattened
    // onto orange background, composited with overlay.png with SE gravity,
    // sharpened, with metadata, 90% quality WebP image data. Phew!
    // console.log(data)
    uploadFile(data)
});
}

module.exports = toU;