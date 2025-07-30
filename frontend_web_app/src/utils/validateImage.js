// utils/validateImage.js
export function validateImageFile(file, maxSizeMB = 1) {
  if (!file) return { valid: false, message: "Please select an image file." };

  const isImage = file.type.startsWith("image/");
  if (!isImage) return { valid: false, message: "Only image files are allowed." };

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      message: `Image must be less than ${maxSizeMB}MB.`,
    };
  }

  return { valid: true };
}
