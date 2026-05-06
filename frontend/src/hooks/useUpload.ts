import { useMutation } from '@tanstack/react-query';
import { uploadApi } from '@/api/upload.api';

export function useUpload() {
  return useMutation({
    mutationFn: (file: File) => uploadApi.uploadImage(file),
  });
}
