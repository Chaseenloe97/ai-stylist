/**
 * Photo Library Access using File System Access API
 * Allows users to select folders and read images
 */

/**
 * Check if File System Access API is supported
 */
export const isFileSystemAccessSupported = () => {
  return 'showDirectoryPicker' in window;
};

/**
 * Prompt user to select a photo folder and read all images
 * @param {Object} options - Options for file reading
 * @param {number} options.maxImages - Maximum number of images to read (default: 50)
 * @param {Array<string>} options.allowedTypes - Allowed image MIME types
 * @returns {Promise<Array<string>>} Array of base64 image data URLs
 */
export const selectPhotoFolder = async (options = {}) => {
  const {
    maxImages = 50,
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic']
  } = options;

  if (!isFileSystemAccessSupported()) {
    throw new Error('File System Access API is not supported in this browser. Please use Chrome, Edge, or Opera.');
  }

  try {
    // Prompt user to select a directory
    const dirHandle = await window.showDirectoryPicker({
      mode: 'read',
      startIn: 'pictures' // Start in Pictures folder if available
    });

    const imageDataUrls = [];
    let count = 0;

    // Recursively read files from directory
    for await (const entry of dirHandle.values()) {
      if (count >= maxImages) break;

      if (entry.kind === 'file') {
        const file = await entry.getFile();

        // Check if file is an allowed image type
        if (allowedTypes.includes(file.type)) {
          const dataUrl = await fileToDataUrl(file);
          imageDataUrls.push(dataUrl);
          count++;
        }
      }
    }

    if (imageDataUrls.length === 0) {
      throw new Error('No images found in the selected folder.');
    }

    return imageDataUrls;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Folder selection was cancelled.');
    }
    throw error;
  }
};

/**
 * Select multiple individual photo files
 * @param {number} maxFiles - Maximum number of files to select
 * @returns {Promise<Array<string>>} Array of base64 image data URLs
 */
export const selectPhotoFiles = async (maxFiles = 20) => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/jpg,image/png,image/webp';
    input.multiple = true;

    input.onchange = async (e) => {
      try {
        const files = Array.from(e.target.files).slice(0, maxFiles);

        if (files.length === 0) {
          reject(new Error('No files selected'));
          return;
        }

        const imageDataUrls = await Promise.all(
          files.map(file => fileToDataUrl(file))
        );

        resolve(imageDataUrls);
      } catch (error) {
        reject(error);
      }
    };

    input.click();
  });
};

/**
 * Convert File object to base64 data URL
 * @param {File} file - File object to convert
 * @returns {Promise<string>} Base64 data URL
 */
const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      resolve(e.target.result);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Compress image if it's too large (to save on API costs and speed)
 * @param {string} dataUrl - Image data URL
 * @param {number} maxWidth - Maximum width in pixels
 * @param {number} maxHeight - Maximum height in pixels
 * @param {number} quality - JPEG quality (0-1)
 * @returns {Promise<string>} Compressed image data URL
 */
export const compressImage = (dataUrl, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      // Calculate new dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to JPEG for better compression
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };

    img.onerror = reject;
    img.src = dataUrl;
  });
};
