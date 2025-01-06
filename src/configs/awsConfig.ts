import { S3Client } from "@aws-sdk/client-s3";

console.log(process.env);
// Config AWS S3 Client
const s3Client = new S3Client({
  region: process.env.REACT_APP_AWS_REGION || "us-west-1", // Thay bằng vùng S3 bucket của bạn
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID || "", // Thay bằng Access Key
    secretAccessKey:
      process.env.REACT_APP_AWS_SECRET_ACCESS_KEY || "YOUR_SECRET_ACCESS_KEY", // Thay bằng Secret Key
  },
});

export default s3Client;
