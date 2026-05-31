import fs from 'fs';
import path from 'path';
import { IStorageProvider } from './storage.interface';

export class LocalStorageProvider implements IStorageProvider {
    private basePath = path.join(process.cwd(), 'uploads');

    async upload(file: Express.Multer.File, folder: string): Promise<string> {
        const targetFolder = path.join(this.basePath, folder);

        if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder, { recursive: true });
        }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const prefix = folder.toUpperCase();
        const filename = `${prefix}-${uniqueSuffix}${ext}`;
        const fullPath = path.join(targetFolder, filename);
        await fs.promises.writeFile(fullPath, file.buffer);

        return filename;
    }

    getFilePath(fileName: string, folder: string): string {
        return path.join(this.basePath, folder, fileName);
    }

    async delete(fileName: string, folder: string): Promise<boolean> {
        const filePath = path.join(this.basePath, folder, fileName);
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
            return true;
        }
        return false;
    }

    async downloadFile(fileName: string, folder: string): Promise<Buffer> {
        const filePath = path.join(this.basePath, folder, fileName);
        if (!fs.existsSync(filePath)) throw new Error('File fisik tidak ditemukan di server.');
        return fs.promises.readFile(filePath);
    }
}