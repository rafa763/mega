const fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});


const uploadFile = (file: string) => {
    fs.readFile(file, (err: any, data: any) => {
        if (err) throw err;
        const params = {
            Bucket: 'dejavux2', // pass your bucket name
            Key: 'dfdfdf', // file will be saved as testBucket/contacts.csv
            Body: data,
            ContentType: 'image/jpeg'
        };
        s3.upload(params, (err: any, data: { Location: any; }) => {
            if (err) {
                throw err;
            } else {
                console.log(`File uploaded successfully at ${data.Location}`)
            }
        });
  });
};

uploadFile('sd.webp');