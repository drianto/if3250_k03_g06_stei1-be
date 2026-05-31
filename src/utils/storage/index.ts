import { IStorageProvider } from './storage.interface';
import { LocalStorageProvider } from './local.provider';
import { SupabaseStorageProvider } from './supabase.provider';

const storageType = process.env.STORAGE_TYPE || 'supabase';

let storageProvider: IStorageProvider;

if (storageType === 'local') {
    storageProvider = new LocalStorageProvider();
} else if (storageType == 'supabase') {
    storageProvider = new SupabaseStorageProvider(); 
} else {
    // TODO: Implementasi Cloud Storage
    // storageProvider = new CloudStorageProvider();

    // Fallback sementara ke lokal
    console.warn("Cloudinary provider belum diimplementasi, fallback ke Local Storage.");
    storageProvider = new SupabaseStorageProvider(); 
}

export { storageProvider };