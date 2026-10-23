import { useCallback, useEffect, useRef, useState } from "react";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "../constants/content";

/** Handles image selection, validation, preview URL lifecycle and errors. */
export default function useImagePicker() {
  const previewUrlRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");

  const revokePreview = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  }, []);

  useEffect(() => revokePreview, [revokePreview]);

  const selectImage = useCallback(
    (file) => {
      if (!file) return;

      setError("");

      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image.");
        return;
      }

      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setError("Please upload a JPG, PNG, or WebP image.");
        return;
      }

      if (file.size > MAX_IMAGE_BYTES) {
        setError("Image size must be 5 MB or less.");
        return;
      }

      revokePreview();

      const url = URL.createObjectURL(file);
      previewUrlRef.current = url;

      setSelectedFile(file);
      setPreviewUrl(url);
    },
    [revokePreview]
  );

  const reset = useCallback(() => {
    revokePreview();
    setSelectedFile(null);
    setPreviewUrl("");
    setError("");
  }, [revokePreview]);

  return { selectedFile, previewUrl, error, setError, selectImage, reset };
}
