/**
 * LifeLogger - Screenshot Safety Module
 */

import CONFIG from './config.js';

class ScreenshotService {
  /**
   * Check if domain should be blocked from screenshots
   */
  isDomainBlocked(url) {
    try {
      const urlObj = new URL(url);
      const fullUrl = url.toLowerCase();

      for (const blocked of CONFIG.BLOCKED_DOMAINS) {
        if (fullUrl.includes(blocked.toLowerCase())) {
          console.log('[LifeLogger] Blocked domain:', blocked);
          return true;
        }
      }

      return false;
    } catch (e) {
      return true; // Block if URL is invalid
    }
  }

  /**
   * Check if page has password fields (called from content script)
   */
  hasPasswordFields() {
    return document.querySelectorAll('input[type="password"]').length > 0;
  }

  /**
   * Check if page is safe to screenshot
   */
  async isSafeToCapture(url) {
    // Check blocked domains
    if (this.isDomainBlocked(url)) {
      return { safe: false, reason: 'blocked_domain' };
    }

    return { safe: true };
  }

  /**
   * Capture screenshot of current tab
   */
  async captureTab(tabId) {
    try {
      const dataUrl = await chrome.tabs.captureVisibleTab(null, {
        format: 'jpeg',
        quality: 70
      });

      // Resize to thumbnail
      const resized = await this.resizeImage(dataUrl, CONFIG.SCREENSHOT_WIDTH);

      return resized;
    } catch (error) {
      console.error('[LifeLogger] Capture failed:', error);
      return null;
    }
  }

  /**
   * Resize image to target width
   */
  async resizeImage(dataUrl, targetWidth) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = targetWidth / img.width;
        canvas.width = targetWidth;
        canvas.height = img.height * ratio;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = dataUrl;
    });
  }

  /**
   * Upload to Cloudinary
   */
  async uploadToCloudinary(dataUrl) {
    if (!CONFIG.CLOUDINARY.CLOUD_NAME || !CONFIG.CLOUDINARY.UPLOAD_PRESET) {
      console.warn('[LifeLogger] Cloudinary not configured');
      return null;
    }

    try {
      const formData = new FormData();
      formData.append('file', dataUrl);
      formData.append('upload_preset', CONFIG.CLOUDINARY.UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY.CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (response.ok) {
        const data = await response.json();
        return data.secure_url;
      }
    } catch (error) {
      console.error('[LifeLogger] Cloudinary upload failed:', error);
    }

    // Fallback to ImgBB
    return this.uploadToImgBB(dataUrl);
  }

  /**
   * Upload to ImgBB (fallback)
   */
  async uploadToImgBB(dataUrl) {
    if (!CONFIG.IMGBB.API_KEY) {
      console.warn('[LifeLogger] ImgBB not configured');
      return null;
    }

    try {
      // Remove data URL prefix
      const base64 = dataUrl.split(',')[1];

      const formData = new FormData();
      formData.append('key', CONFIG.IMGBB.API_KEY);
      formData.append('image', base64);

      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        return data.data.url;
      }
    } catch (error) {
      console.error('[LifeLogger] ImgBB upload failed:', error);
    }

    return null;
  }

  /**
   * Capture and upload screenshot
   */
  async captureAndUpload(tabId, url) {
    // Safety check
    const safetyCheck = await this.isSafeToCapture(url);
    if (!safetyCheck.safe) {
      console.log('[LifeLogger] Skipping screenshot:', safetyCheck.reason);
      return null;
    }

    // Capture
    const screenshot = await this.captureTab(tabId);
    if (!screenshot) return null;

    // Upload
    const uploadedUrl = await this.uploadToCloudinary(screenshot);
    return uploadedUrl;
  }
}

export const screenshot = new ScreenshotService();
export default screenshot;
