// src/services/api/uploadService.ts
import axiosInstance from '../../store/services/axiosInstance';
import axios from 'axios';

export interface PresignedUrlResponse {
  uploadUrl: string;
  key: string;
}

export const uploadService = {
  // Get presigned URL for file upload
  getPresignedUrl: async (userId: string, fileType: string, apiPath: string = ''): Promise<PresignedUrlResponse> => {
    const response = await axiosInstance.post(`${apiPath}upload-url`, {
      userId,
      fileType,
    });
    return response.data;
  },
  
  // Upload file using presigned URL
  uploadFileWithPresignedUrl: async (file: File, uploadUrl: string): Promise<string> => {
    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type
      }
    });
    
    // Return the S3 object URL (this is a placeholder - adjust based on your backend)
    const urlParts = uploadUrl.split('?');
    return urlParts[0];
  }
};