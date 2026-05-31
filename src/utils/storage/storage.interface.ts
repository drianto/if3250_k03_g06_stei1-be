export interface IStorageProvider {
    /**
     * Mengunggah file dan mengembalikan path/key unik penyimpanannya
     * @param file 
     * @param folder 
     */
    upload(file: Express.Multer.File, folder: string): Promise<string>;

    /**
     * Mengambil path absolut atau URL file untuk keperluan download
     * @param fileName 
     * @param folder 
     */
    getFilePath(fileName: string, folder: string): string;

    /**
     * Menghapus file secara fisik dari storage
     * @param fileName 
     * @param folder 
     */
    delete(fileName: string, folder: string): Promise<boolean>;

    /**
     * Download File langsung
     * @param fileName 
     * @param folder 
     */
    downloadFile(fileName: string, folder: string): Promise<Buffer>;
}