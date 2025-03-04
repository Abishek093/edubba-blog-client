import axios from 'axios';
import axiosInstance from '../store/services/axiosInstance'; 

export const getPresignedUrl = async (userId: string, fileType: string, apiUrl: string): Promise<{ uploadUrl: string, key: string }> => {
  try {
    console.log("Frontend: Requesting pre-signed URL...", `${apiUrl}upload-url`);
    console.log("Frontend: Request payload:", { userId, fileType });

    const response = await axiosInstance.post(`${apiUrl}upload-url`, {
      userId,
      fileType,
    });
    
    console.log("Frontend: Pre-signed URL response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Frontend: Failed to get pre-signed URL", error);
    throw new Error('Could not get pre-signed URL');
  }
};

export const uploadImageToS3 = async (uploadUrl: string, imageBlob: Blob): Promise<void> => {
  try {
    console.log("Uploading image to S3...");
    const response = await axios.put(uploadUrl, imageBlob, {
      headers: {
        'Content-Type': imageBlob.type || 'image/jpeg',
      },
    });

    if (response.status !== 200) {
      throw new Error('Failed to upload image to S3');
    }

    console.log("Image uploaded to S3 successfully");
  } catch (error) {
    console.error("Failed to upload image to S3", error);
    throw new Error('Image upload to S3 failed');
  }
};

export const base64ToBlob = (base64Image: string, contentType: string): Blob => {
  try {
    const byteString = window.atob(base64Image);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: contentType });
  } catch (error) {
    console.error('Failed to convert base64 to Blob', error);
    throw error;
  }
};
