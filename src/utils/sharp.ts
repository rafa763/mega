import sharp from 'sharp';
import uploadFile from './s3';

// sharp('DE.png')
//     .resize({
//         width: 90,
//         height: 90,
//         fit: sharp.fit.cover,
//         withoutReduction: true
//     })
// //   .flatten( { background: '#ff6600' } )
//     .sharpen()
//     .withMetadata()
//     .webp( { quality: 100 } )
//     .toFile('n.png')

function toAws(file: Buffer) {
    

sharp(file)
    .resize({
        width: 500,
        // height: 500,
        fit: sharp.fit.cover,
        withoutReduction: true
    })
    // .flatten( { background: '#ff6600' } )
    .composite([{ input: 'n.png', gravity: 'southeast' }])
    .sharpen()
    .withMetadata()
    .webp( { quality: 100 } )
    // .toFile('combineed.png')
    .toBuffer()
    .then(data => {
        uploadFile(data);
        // console.log(data);
    }).catch(err => { throw new Error("Error in toAws: " + err) });

}
export default toAws;