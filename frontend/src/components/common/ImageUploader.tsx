import { useRef, useState } from 'react';
import { useUpload } from '@/hooks/useUpload';

interface ImageUploaderProps {
  currentUrl?: string;
  onUploadComplete: (url: string) => void;
}

export default function ImageUploader({ currentUrl, onUploadComplete }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const uploadMutation = useUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 미리보기
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    // 업로드
    const res = await uploadMutation.mutateAsync(file);
    if (res.success && res.data) {
      onUploadComplete(res.data.url);
    }
  };

  return (
    <div className="space-y-2">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="w-full h-32 rounded-xl border-2 border-dashed border-surface-border hover:border-primary-500/50 flex items-center justify-center cursor-pointer transition-colors overflow-hidden"
        data-testid="image-uploader"
      >
        {preview ? (
          <img src={preview} alt="미리보기" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center">
            <p className="text-gray-500 text-sm">클릭하여 이미지 업로드</p>
            <p className="text-gray-600 text-xs mt-1">JPG, PNG (최대 5MB)</p>
          </div>
        )}
      </div>

      {uploadMutation.isPending && (
        <p className="text-xs text-primary-400">업로드 중...</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
