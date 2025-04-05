import { useState } from 'react';
import { uploadService } from '../services/api/uploadService';

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file: File, userId: string, apiPath: string = '') => {
    try {
      setUploading(true);
      setProgress(10);
      setError(null);
      
      // Get presigned URL
      const { uploadUrl, key } = await uploadService.getPresignedUrl(
        userId,
        file.type,
        apiPath
      );
      
      setProgress(30);
      
      // Upload file to S3
      const fileUrl = await uploadService.uploadFileWithPresignedUrl(file, uploadUrl);
      
      setProgress(100);
      setUploadedUrl(fileUrl);
      return { url: fileUrl, key };
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload file');
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFile,
    uploading,
    error,
    uploadedUrl,
    progress
  };
};