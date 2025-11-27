const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN
  }
});

exports.uploadToS3 = async (file) => {
  try {
    const fileStream = fs.createReadStream(file.path);

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `uploads/${Date.now()}-${file.originalname}`,
      Body: fileStream,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    // opcional: borrar archivo local
    fs.unlinkSync(file.path);

    return {
      message: "Archivo subido correctamente a S3",
      key: params.Key,
      bucket: params.Bucket
    };

  } catch (err) {
    throw new Error("Error subiendo archivo a S3: " + err.message);
  }
};
