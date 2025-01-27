// LIBRARIES
const { v4: uuidv4 }       = require("uuid");
const { minioClient }      = require("./minio.service");

// ESSENTIALS
exports.upload = async (bucketName, folderName, type, file) => {
    try {
        if (!file?.length) {
            throw new Error("Invalid file!");
        }

        const fileContent = file[0];
        const fileName = `${uuidv4()}.${type}`;
        const fullPath = `${folderName}/${fileName}`;

        const bucketExists = await minioClient.bucketExists(bucketName);
        if (!bucketExists) {
            await minioClient.makeBucket(bucketName, 'us-east-1');

             const bucketPolicy = {
                Version: "2012-10-17",
                Statement: [
                    {
                        Effect: "Allow",
                        Principal: "*",
                        Action: ["s3:GetObject"],
                        Resource: [`arn:aws:s3:::${bucketName}/*`],
                    },
                ],
            };

            await minioClient.setBucketPolicy(bucketName, JSON.stringify(bucketPolicy));
        }

        await minioClient.putObject(bucketName, fullPath, fileContent.buffer);
        
        const fileUrl = `http://${minioClient.host}:${minioClient.port}/${bucketName}/${fullPath}`;
        
        return [fileUrl, fileName];

    } catch (error) {
        throw new Error(error.message);
    }
};

exports.delete = async (bucketName, folderName, fileName) => {
    try {
        if (!fileName) {
            throw new Error("Invalid file name");
        }

        const fullPath = `${folderName}/${fileName}`;

        await minioClient.removeObject(bucketName, fullPath);
        
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};