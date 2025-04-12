import { Request } from 'express';
import fs from 'fs';
import path from 'path';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

export const handleFileUpload = (req: Request): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (!req.headers['content-type']?.startsWith('multipart/form-data')) {
            return reject(new Error('Invalid content type'));
        }

        const chunks: Buffer[] = [];
        let totalBytes = 0;

        req.on('data', (chunk: Buffer) => {
            totalBytes += chunk.length;
            if (totalBytes > MAX_FILE_SIZE) {
                req.destroy();
                return reject(new Error('File size exceeds limit'));
            }
            chunks.push(chunk);
        });

        req.on('end', () => {
            const buffer = Buffer.concat(chunks);
            const mimeType = req.headers['content-type']?.split(';')[0];
            
            if (!mimeType || !ALLOWED_MIME_TYPES.includes(mimeType)) {
                return reject(new Error('Invalid file type'));
            }

            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
            // Use /tmp for writable storage in serverless environments
            const filePath = path.join('/tmp', fileName);

            fs.writeFile(filePath, buffer, (err) => {
                if (err) return reject(err);
                resolve(filePath);
            });
        });

        req.on('error', (err) => {
            reject(err);
        });
    });
};