import { Request, Response } from 'express';
import * as ledService from '../services/led.service';
import { successResponse, errorResponse } from '../utils/response';
import { Role } from '@prisma/client';

/**
 * @swagger
 * /api/led/import:
 *   post:
 *     summary: Import/Upload dokumen LED (S-02-32)
 *     tags:
 *       - LED
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - prodiId
 *               - periode
 *               - file
 *             properties:
 *               prodiId:
 *                 type: integer
 *                 example: 1
 *               periode:
 *                 type: string
 *                 example: "2025"
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Dokumen LED berhasil diimpor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Data atau file tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Tidak terautentikasi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const importLEDHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const pengunggahId = String(req.user?.userId); 
        const prodiId = String(req.body.prodiId);
        const periode = String(req.body.periode);
        const file = req.file; 

        if (!req.user?.userId) {
            errorResponse(res, 'Pengguna tidak terautentikasi', 401);
            return;
        }
        if (!file) {
            errorResponse(res, 'File dokumen LED wajib diunggah', 400);
            return;
        }

        const dokumen = await ledService.importLED({
            prodiId,
            pengunggahId,
            periode,
            file,
        });

        successResponse(res, dokumen, 'Dokumen LED berhasil diimpor', 201);
    } catch (err: any) {
        errorResponse(res, err.message, 500);
    }
};

/**
 * @swagger
 * /api/led/export/{prodiId}/{periode}:
 *   get:
 *     summary: Export/Download dokumen LED versi terbaru (S-02-33)
 *     tags:
 *       - LED
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: prodiId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: periode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File dokumen LED (Binary)
 *         content:
 *           application/vnd.openxmlformats-officedocument.wordprocessingml.document:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Parameter tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Dokumen tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const exportLEDHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const prodiId = String(req.params.prodiId);
        const periode = String(req.params.periode);

        if (!req.params.prodiId || !req.params.periode) {
            errorResponse(res, 'Parameter prodiId dan periode tidak valid', 400); return;
        }

        const { dokumen } = await ledService.exportLED(prodiId, periode);
        const downloadName = dokumen.name || 'LED_Document.docx';

        if (!dokumen.content || typeof dokumen.content !== 'string') {
            errorResponse(res, 'File dokumen LED belum diunggah atau tidak tersedia', 404);
            return;
        }

        const { storageProvider } = await import('../utils/storage');
        const buffer = await storageProvider.downloadFile(dokumen.content, 'led');
        
        const encodedName = encodeURIComponent(downloadName);
        res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedName}`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.send(buffer);
    } catch (err: any) {
        const code = err.message.includes('belum tersedia') ? 404 : 500;
        errorResponse(res, err.message, code);
    }
};

/**
 * @swagger
 * /api/led/history/{prodiId}/{periode}:
 *   get:
 *     summary: Mendapatkan riwayat versi dokumen LED
 *     tags:
 *       - LED
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: prodiId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: periode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Riwayat dokumen LED berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
export const getLEDHistoryHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const prodiId = String(req.params.prodiId);
        const periode = String(req.params.periode);

        if (!req.params.prodiId || !req.params.periode) {
            errorResponse(res, 'Parameter prodiId dan periode tidak valid', 400);
            return;
        }

        const history = await ledService.getLEDHistory(prodiId, periode);
        successResponse(res, history, 'Riwayat dokumen LED berhasil diambil');
    } catch (err: any) {
        errorResponse(res, err.message, 500);
    }
};

/**
 * @swagger
 * /api/led/periods/{prodiId}:
 *   get:
 *     summary: Mendapatkan daftar periode yang tersedia untuk Prodi
 *     tags: 
 *       - LED
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: prodiId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Daftar periode berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Parameter tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
const userHasProdiAccess = (req: Request, prodiId: string): boolean => {
    const user = req.user;
    if (!user) return false;
    if (user.role === Role.KAPRODI || user.role === Role.TIM_PRODI) {
        return user.prodiId === prodiId;
    }
    return true;
};

export const getAvailablePeriodsHandler = async (req: Request, res: Response): Promise<void> => {
    try {
    const prodiId = String(req.params.prodiId);

    if (!req.params.prodiId) {
        errorResponse(res, 'Parameter prodiId wajib diisi', 400);
        return;
    }

    const periods = await ledService.getAvailablePeriods(prodiId);

    // Jika masih kosong banget (prodi baru), defaultnya tahun ini
    const finalPeriods = periods.length > 0 ? periods : [new Date().getFullYear().toString()];

    successResponse(res, finalPeriods, 'Daftar periode berhasil diambil');
    } catch (err: any) {
        errorResponse(res, err.message, 500);
    }
};

export const createLEDFormHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const pengunggahId = String(req.user?.userId);
        const prodiId = String(req.params.prodiId);
        const { template, periode, content } = req.body;

        if (!req.user?.userId) {
            errorResponse(res, 'Pengguna tidak terautentikasi', 401);
            return;
        }

        if (!req.user?.prodiId || req.user.prodiId !== prodiId) {
            errorResponse(res, 'Akses ditolak: hanya pengguna prodi yang sama dapat menyimpan form', 403);
            return;
        }

        const ledForm = await ledService.createLEDFormVersion({
            prodiId,
            template,
            periode,
            content,
            createdById: pengunggahId,
        });

        successResponse(res, ledForm, 'Versi LED form berhasil dibuat', 201);
    } catch (err: any) {
        errorResponse(res, err.message, 500);
    }
};

export const getLEDFormHistoryHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const prodiId = String(req.params.prodiId);
        const periode = String(req.params.periode);

        if (!req.params.prodiId || !req.params.periode) {
            errorResponse(res, 'Parameter prodiId dan periode tidak valid', 400);
            return;
        }

        if (!userHasProdiAccess(req, prodiId)) {
            errorResponse(res, 'Akses ditolak', 403);
            return;
        }

        const template = typeof req.query.template === 'string' ? req.query.template : undefined;
        const history = await ledService.getLEDFormHistory(prodiId, periode, template);
        successResponse(res, history, 'Riwayat LED form berhasil diambil');
    } catch (err: any) {
        errorResponse(res, err.message, 500);
    }
};

export const getLEDFormVersionHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const versionId = String(req.params.versionId);
        if (!versionId) {
            errorResponse(res, 'Parameter versionId wajib diisi', 400);
            return;
        }

        const version = await ledService.getLEDFormVersionById(versionId);
        if (!version) {
            errorResponse(res, 'Versi LED form tidak ditemukan', 404);
            return;
        }

        if (!userHasProdiAccess(req, version.prodiId)) {
            errorResponse(res, 'Akses ditolak', 403);
            return;
        }

        successResponse(res, version, 'Versi LED form berhasil diambil');
    } catch (err: any) {
        errorResponse(res, err.message, 500);
    }
};

export const exportLEDFormHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = String(req.params.id);
        const periode = typeof req.query.periode === 'string' ? req.query.periode : undefined;

        if (!id) {
            errorResponse(res, 'Parameter id wajib diisi', 400);
            return;
        }

        const template = typeof req.query.template === 'string' ? req.query.template : undefined;
        const { buffer, filename } = await ledService.exportLEDForm(id, periode, template);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.status(200).send(buffer);
    } catch (err: any) {
        const code = err.message.includes('belum tersedia') || err.message.includes('tidak ditemukan') ? 404 : 500;
        errorResponse(res, err.message, code);
    }
};

/**
 * @swagger
 * /api/led/export/document/{id}:
 *   get:
 *     summary: Export dokumen LED berdasarkan ID spesifik
 *     tags:
 *       - LED
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dokumen berhasil diexport
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Parameter ID tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Dokumen tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const exportLEDByIdHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = String(req.params.id);
        if (!id) {
            errorResponse(res, 'Parameter ID wajib diisi', 400); return;
        }

        const { dokumen } = await ledService.exportLEDById(id);
        const downloadName = dokumen.name || `LED_Document_V${dokumen.versi}.docx`;

        if (!dokumen.content || typeof dokumen.content !== 'string') {
            errorResponse(res, 'File dokumen LED belum diunggah atau tidak tersedia', 404);
            return;
        }

        const { storageProvider } = await import('../utils/storage');
        const buffer = await storageProvider.downloadFile(dokumen.content, 'led');
        
        const encodedName = encodeURIComponent(downloadName);
        res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedName}`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.send(buffer);
    } catch (err: any) {
        errorResponse(res, err.message, 404);
    }
};

export const softDeleteDocumentHandler = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        await ledService.softDeleteDocument(id);
        successResponse(res, null, 'Dokumen berhasil dipindahkan ke tempat sampah');
    } catch (err: any) {
        const code = err.message.includes('tidak dapat dihapus') ? 400 : 500;
        errorResponse(res, err.message, code);
    }
};

export const softDeleteAllDraftsHandler = async (req: Request, res: Response) => {
    try {
        const prodiId = String(req.params.prodiId);
        const periode = String(req.params.periode);

        if (!req.params.prodiId || !req.params.periode) {
            errorResponse(res, 'Parameter prodiId dan periode tidak valid', 400);
            return;
        }

        await ledService.softDeleteAllDrafts(prodiId, periode);
        successResponse(res, null, 'Semua versi draft berhasil dihapus');
    } catch (err: any) {
        const code = err.message.includes('FINAL') ? 400 : 500;
        errorResponse(res, err.message, code);
    }
};

export const uploadLEDImageHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user?.userId) {
            errorResponse(res, 'Pengguna tidak terautentikasi', 401);
            return;
        }
        if (!req.file) {
            errorResponse(res, 'File gambar wajib diunggah', 400);
            return;
        }
        
        const { storageProvider } = await import('../utils/storage');
        const savedFilename = await storageProvider.upload(req.file, 'led');
        const imageUrl = storageProvider.getFilePath(savedFilename, 'led');

        successResponse(res, { url: imageUrl, path: imageUrl }, 'Gambar berhasil diunggah', 201);
    } catch (err: any) {
        errorResponse(res, err.message, 500);
    }
};

export const toggleDocumentLEDStatusHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = String(req.params.id);
        const { status } = req.body;
        const user = req.user as any;

        const { dokumen } = await ledService.exportLEDById(id);
        if (user.role === 'KAPRODI' && dokumen.prodiId !== user.prodiId) {
            errorResponse(res, 'Akses ditolak: Anda hanya dapat mengunci dokumen prodi Anda sendiri', 403);
            return;
        }

        const updated = await ledService.toggleDocumentLEDStatus(id, status, user.userId);
        successResponse(res, updated, `Dokumen LED berhasil diubah menjadi ${status}`);
    } catch (err: any) {
        errorResponse(res, err.message, 500);
    }
};

export const toggleLEDFormStatusHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = String(req.params.id);
        const { status } = req.body;
        const user = req.user as any;

        const version = await ledService.getLEDFormVersionById(id);
        if (!version) {
            errorResponse(res, 'Form LED tidak ditemukan', 404);
            return;
        }

        if (user.role === 'KAPRODI' && version.prodiId !== user.prodiId) {
            errorResponse(res, 'Akses ditolak: Anda hanya dapat mengunci form prodi Anda sendiri', 403);
            return;
        }

        const updated = await ledService.toggleLedFormStatus(id, status, user.userId);
        successResponse(res, updated, `Form LED berhasil diubah menjadi ${status}`);
    } catch (err: any) {
        errorResponse(res, err.message, 500);
    }
};

export const updateLEDFormHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = String(req.params.id);
        const { content } = req.body;
        
        // Memanggil service untuk update konten
        const updatedForm = await ledService.updateLEDFormVersion(id, content);
        
        successResponse(res, updatedForm, 'Form LED berhasil diperbarui (autosave)');
    } catch (err: any) {
        errorResponse(res, err.message, 500);
    }
};