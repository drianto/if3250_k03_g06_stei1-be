import path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IStorageProvider } from './storage.interface';
import WebSocket from 'ws'; // <--- TAMBAHKAN IMPORT INI

export class SupabaseStorageProvider implements IStorageProvider {
    private supabase: SupabaseClient;
    private bucketName: string;

    constructor() {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 
        const supabaseOptions = {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false
            },
            realtime: {
                transport: WebSocket as any 
            }
        };

        if (!supabaseUrl || !supabaseKey) {
            console.error("X ERROR: SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY tidak ditemukan di environment variables!");
            // We shouldn't create a dummy client because it will hang or timeout
            this.supabase = null as any;
        } else {
            this.supabase = createClient(supabaseUrl, supabaseKey, supabaseOptions);
        }

        this.bucketName = process.env.SUPABASE_BUCKET_NAME || 'dokumen-akreditasi';
    }

    async upload(file: Express.Multer.File, folder: string): Promise<string> {
        if (!this.supabase) {
            console.warn(`[SUPABASE] Mode offline/dummy. Mengembalikan nama file palsu.`);
            return `${folder}-dummy-${Date.now()}.xlsx`;
        }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const prefix = folder.toUpperCase();
        
        // Nama file bersih yang akan disimpan di Database
        const filename = `${prefix}-${uniqueSuffix}${ext}`;
        
        // Path spesifik di dalam bucket Supabase
        const filePathInBucket = `${folder}/${filename}`;

        console.log(`[SUPABASE] Mengunggah ke bucket '${this.bucketName}', path: '${filePathInBucket}'...`);

        const { error } = await this.supabase.storage
            .from(this.bucketName)
            .upload(filePathInBucket, file.buffer, {
                contentType: file.mimetype,
                upsert: false 
            });

        if (error) {
            console.error(`[SUPABASE ERROR]:`, error);
            throw new Error(`Gagal upload ke Supabase: ${error.message}`);
        }

        console.log(`[SUPABASE] Berhasil mengunggah ${filename}`);
        
        return filename;
    }

    getFilePath(fileName: string, folder: string): string {
        if (!this.supabase) return `https://dummy.supabase.co/${folder}/${fileName}`;
        const filePathInBucket = `${folder}/${fileName}`;
        
        const { data } = this.supabase.storage
            .from(this.bucketName)
            .getPublicUrl(filePathInBucket);
            
        return data.publicUrl;
    }

    async delete(fileName: string, folder: string): Promise<boolean> {
        if (!this.supabase) return true;
        const filePathInBucket = `${folder}/${fileName}`;
        
        const { error } = await this.supabase.storage
            .from(this.bucketName)
            .remove([filePathInBucket]);

        if (error) {
            console.error(`Gagal menghapus file di Supabase: ${error.message}`);
            return false;
        }
        return true;
    }

    async downloadFile(fileName: string, folder: string): Promise<Buffer> {
        if (!this.supabase) return Buffer.from("Dummy file content");
        const filePathInBucket = `${folder}/${fileName}`;
        const { data, error } = await this.supabase.storage
            .from(this.bucketName)
            .download(filePathInBucket);

        if (error) {
            console.error(`[SUPABASE ERROR] Gagal download file private:`, error);
            throw new Error(`File gagal diunduh dari storage: ${error.message}`);
        }

        const arrayBuffer = await data.arrayBuffer();
        return Buffer.from(arrayBuffer);
    }
}