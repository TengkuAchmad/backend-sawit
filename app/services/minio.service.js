// ENVIRONMENTS
require('dotenv').config();

// CONSTANTS
const { MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY } = process.env;

const Minio = require("minio");

const minioClient = new Minio.Client({
    endPoint: MINIO_ENDPOINT,
    port: 9000,
    useSSL: false,
    accessKey: MINIO_ACCESS_KEY,
    secretKey: MINIO_SECRET_KEY,
});

module.exports = { minioClient } ;