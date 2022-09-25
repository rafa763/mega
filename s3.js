const fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});


function uploadFile(data)  {
    
        // console.log(data)
        // if (err) throw err;
        const params = {
            Bucket: 'dejavux2', // pass your bucket name
            Key: 'dfdfdf', // file will be saved as testBucket/contacts.csv
            Body: data,
            ContentType: 'image/jpeg'
        }
        const uploadedImage = s3.upload(params, (err, data) => {
            if (err) {
                throw err;
            } else {
                console.log(`File uploaded successfully at ${data.Location}`)
            }
        });
};

module.exports = uploadFile;
// uploadFile('we.jpg');