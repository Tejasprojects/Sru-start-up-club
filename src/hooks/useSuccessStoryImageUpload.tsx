
import { useState } from "react";
import { uploadSuccessStoryImage } from "@/lib/successStoriesHelpers";
import { useToast } from "@/hooks/use-toast";

/**
 * Custom hook to handle success story image uploads
 */
export function useSuccessStoryImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const uploadImage = async (file: File | null): Promise<string | null> => {
    if (!file) {
      setError("No file selected");
      toast({
        title: "Upload error",
        description: "No file selected",
        variant: "destructive",
      });
      return null;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      const errorMessage = "Please select a valid image file (JPEG, PNG, GIF, or WEBP)";
      setError(errorMessage);
      toast({
        title: "Invalid file type",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
    
    // Validate file size (15MB max)
    if (file.size > 15 * 1024 * 1024) {
      const errorMessage = "File size must be less than 15MB";
      setError(errorMessage);
      toast({
        title: "File too large",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }

    setIsUploading(true);
    setProgress(10);
    setError(null);

    try {
      console.log("Starting success story image upload, file:", file.name, file.size, file.type);
      
      setProgress(30);
      
      const result = await uploadSuccessStoryImage(file);
      
      if (!result.success || !result.url) {
        throw new Error(result.error?.message || "Upload failed");
      }
      
      setProgress(100);
      console.log("Upload complete, URL:", result.url);

      toast({
        title: "Upload successful",
        description: "Image has been successfully uploaded",
      });
      
      return result.url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error during upload";
      console.error("Upload error:", errorMessage);
      setError(errorMessage);
      
      toast({
        title: "Upload failed",
        description: `Error: ${errorMessage}. Please try again.`,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 1000); // Reset progress after a delay
    }
  };

  const resetUpload = () => {
    setProgress(0);
    setError(null);
  };

  return {
    uploadImage,
    resetUpload,
    isUploading,
    progress,
    error
  };
}
