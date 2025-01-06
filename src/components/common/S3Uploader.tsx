import axios from "axios";
import React, { useState, forwardRef, useImperativeHandle } from "react";

interface S3UploaderProps {
  fieldName: string; // Thêm prop để xác định trường
  onUploadSuccess?: (fieldName: string, url: string) => void;
  onUploadError?: (fieldName: string, error: string) => void;
  onFileRemove?: (fieldName: string) => void;
}

const S3Uploader = forwardRef<
  { handleFileRemove: (fieldName: string) => void },
  S3UploaderProps
>(({ fieldName, onUploadSuccess, onUploadError, onFileRemove }, ref) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);

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

    try {
      setUploading(true);
      setMessage("");

      // Sử dụng tên file để tạo key
      const key = `uploads/${file.name}`;

      // Gọi API để lấy Pre-Signed URL
      const response = await axios.get(
        "http://localhost:3000/s3/presigned-url",
        {
          params: {
            key,
            type: file.type,
          },
        }
      );

      const { url } = response.data.data;

      // Upload file lên S3 qua Pre-Signed URL
      const uploadResponse = await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      const imgUrl = url.split("?")[0];

      if (uploadResponse.status === 200) {
        setMessage("File uploaded successfully!");
        setFileUrl(imgUrl);
        onUploadSuccess?.(fieldName, imgUrl);
      } else {
        setMessage("Error uploading file.");
        onUploadError?.(fieldName, "Error uploading file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Error uploading file.");
      onUploadError?.(fieldName, "Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileUrl(null);
    setMessage("File removed.");
    onFileRemove?.(fieldName);
  };

  useImperativeHandle(ref, () => ({
    handleFileRemove: () => handleRemoveFile(),
  }));

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        {!fileUrl && (
          <div className="flex gap-2">
            <input
              type="file"
              onChange={handleFileChange}
              className="border rounded p-1 text-xs focus:ring-1 focus:ring-blue-500 w-40"
            />
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-blue-500 text-white px-1 py-0.5 text-xs rounded"
            >
              {uploading ? ".." : "Up"}
            </button>
          </div>
        )}

        {fileUrl && (
          <div className="flex items-center space-x-4">
            {file?.type.startsWith("image/") && (
              <div className="relative group">
                <img
                  src={fileUrl}
                  alt="Uploaded"
                  className="w-16 h-16 object-cover border rounded-lg shadow-sm"
                />
                <button
                  onClick={handleRemoveFile}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs 
                             hover:bg-red-600 transition-colors shadow-md opacity-0 group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            )}
            {message === "File uploaded successfully!" && (
              <span className="text-green-500 text-xl">✓</span>
            )}
            {file?.type.startsWith("audio/") && (
              <div className="relative group">
                <audio controls className="w-40 h-10 rounded border shadow-sm">
                  <source src={fileUrl} type={file.type} />
                  Your browser does not support the audio element.
                </audio>
                <button
                  onClick={handleRemoveFile}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-md opacity-0 group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default S3Uploader;
