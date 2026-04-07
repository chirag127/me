import {
  PutObjectCommand,
  S3Client,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Cloudflare R2 Client Utility
 * Uses the S3-compatible API for Node.js environments.
 */
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'chirag-media-posters';
const PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN;

/**
 * Checks if an image exists in the R2 bucket.
 * @param filename - Name of the file (e.g., 'tt123456.jpg')
 */
export async function imageExists(filename: string): Promise<boolean> {
  try {
    await r2Client.send(
      new HeadObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `posters/${filename}`,
      }),
    );
    return true;
  } catch (error: any) {
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
      return false;
    }
    console.error(`[R2] Error checking ${filename}:`, error.message);
    return false;
  }
}

/**
 * Uploads an image buffer to the R2 bucket.
 * @param filename - Name of the file to save as
 * @param buffer - Buffer of the image data
 * @param contentType - MIME type (e.g., 'image/jpeg')
 */
export async function uploadImage(
  filename: string,
  buffer: Buffer,
  contentType: string = 'image/jpeg',
): Promise<string | null> {
  try {
    await r2Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `posters/${filename}`,
        Body: buffer,
        ContentType: contentType,
      }),
    );
    
    // Return the public URL if configured
    if (PUBLIC_DOMAIN) {
      return `${PUBLIC_DOMAIN.replace(/\/$/, '')}/posters/${filename}`;
    }
    
    return null;
  } catch (error: any) {
    console.error(`[R2] Upload failed for ${filename}:`, error.message);
    return null;
  }
}

/**
 * Resolves the public URL for a poster
 * @param filename - Name of the file
 */
export function getPosterUrl(filename: string): string | null {
  if (!PUBLIC_DOMAIN) return null;
  return `${PUBLIC_DOMAIN.replace(/\/$/, '')}/posters/${filename}`;
}
