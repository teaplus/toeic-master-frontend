import React, { useState } from "react";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../../configs/awsConfig";

const S3Uploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setMessage("");

    const params = {
      Bucket: process.env.REACT_APP_AWS_BUCKET_NAME || "my-toeic-bucket", // Thay bằng tên bucket
      Key: `uploads/${file.name}`, // Đường dẫn file trong bucket
      Body: file,
      ContentType: file.type,
    };

    console.log("type", file.type);

    try {
      const command = new PutObjectCommand(params);
      await s3Client.send(command);
      setMessage("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1>S3 File Uploader</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default S3Uploader;
