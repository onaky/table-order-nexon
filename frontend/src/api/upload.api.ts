import apiClient from './client';
import { ApiResponse, UploadResponse } from '@/types';

const USE_MOCK = false;

export const uploadApi = {
  uploadImage: async (file: File): Promise<ApiResponse<UploadResponse>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 1000));
      const mockUrl = URL.createObjectURL(file);
      return {
        success: true,
        data: {
          filename: `mock-${Date.now()}-${file.name}`,
          url: mockUrl,
        },
      };
    }
    const formData = new FormData();
    formData.append('image', file);
    const res = await apiClient.post('/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    // BE 응답: { imageUrl: "/uploads/filename.jpg" }
    const imageUrl = res.data.data?.imageUrl ?? '';
    const filename = imageUrl.replace('/uploads/', '');
    return { success: true, data: { filename, url: imageUrl } };
  },

  deleteImage: async (filename: string): Promise<ApiResponse<void>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return { success: true };
    }
    const res = await apiClient.delete(`/uploads/${filename}`);
    return res.data;
  },
};
