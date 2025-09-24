"use client";

import { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/common/components/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/components/Avatar';

interface ProfileImageUploadProps {
  currentImage?: string;
  userName?: string;
  onImageChange: (imageUrl: string) => void;
}

export default function ProfileImageUpload({ 
  currentImage, 
  userName, 
  onImageChange 
}: ProfileImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be less than 2MB');
      return;
    }

    setUploading(true);
    
    try {
      // Create preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // In a real app, you'd upload to a service like Cloudinary or AWS S3
      // For now, we'll simulate the upload and use the preview URL
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onImageChange(preview);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayImage = previewUrl || currentImage;

  return (
    <div className="flex items-center space-x-6">
      <div className="relative">
        <Avatar className="w-24 h-24">
          <AvatarImage src={displayImage} alt={userName || 'User'} />
          <AvatarFallback className="bg-blue-600 text-white text-2xl">
            {userName?.split(' ').map((n) => n[0]).join('') || 'U'}
          </AvatarFallback>
        </Avatar>
        
        {displayImage && (
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        )}
      </div>

      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          variant="outline"
          className="border-zinc-600 text-zinc-300 hover:text-white"
        >
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <Camera className="w-4 h-4 mr-2" />
              Change Photo
            </>
          )}
        </Button>
        
        <p className="text-xs text-zinc-400">
          PNG, JPG up to 2MB
        </p>
      </div>
    </div>
  );
}