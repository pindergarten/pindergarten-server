const AWS = require('aws-sdk');
const secret_config = require('./secret');

const s3 = new AWS.S3({
    accessKeyId: secret_config.AWS_ACCESS_KEY_ID,
    secretAccessKey: secret_config.AWS_SECRET_ACCESS_KEY,
    region: secret_config.AWS_REGION
});
module.exports = s3;