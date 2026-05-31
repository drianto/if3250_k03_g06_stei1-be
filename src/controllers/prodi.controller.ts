import { Request, Response } from 'express';
import * as prodiService from '../services/prodi.service';
import { successResponse, errorResponse } from '../utils/response';

/**
 * @swagger
 * /api/prodi:
 *   get:
 *     summary: Mendapatkan semua program studi
 *     tags: [Prodi]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar semua program studi berhasil diambil
 *       401:
 *         description: Tidak terautentikasi
 */
export const getAllProdiHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const prodis = await prodiService.getAllProdi();
    successResponse(res, prodis, 'Daftar program studi berhasil diambil');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
};

/**
 * @swagger
 * /api/prodi/my-prodi:
 *   get:
 *     summary: Mendapatkan prodi yang dapat diakses oleh pengguna
 *     tags: [Prodi]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar prodi berhasil diambil
 */
export const getMyProdiHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as any)?.userId;

  if (!userId) {
    errorResponse(res, 'Pengguna tidak terautentikasi', 401);
    return;
  }

  try {
    const prodis = await prodiService.getProdiForUser(userId);
    successResponse(res, prodis, 'Daftar prodi berhasil diambil');
  } catch (err: any) {
    const message = err?.message || 'Gagal mengambil daftar prodi';
    errorResponse(res, message, 500);
  }
};

/**
 * @swagger
 * /api/prodi/{id}:
 *   get:
 *     summary: Mendapatkan detail program studi berdasarkan ID
 *     tags: [Prodi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID program studi
 *     responses:
 *       200:
 *         description: Data program studi berhasil diambil
 *       404:
 *         description: Program studi tidak ditemukan
 */
export const getProdiByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const prodi = await prodiService.getProdiById(req.params.id as string);
    successResponse(res, prodi, 'Data program studi berhasil diambil');
  } catch (err: any) {
    const code = err.message.includes('tidak ditemukan') ? 404 : 500;
    errorResponse(res, err.message, code);
  }
};

/**
 * @swagger
 * /api/prodi/{id}:
 *   put:
 *     summary: Memperbarui data program studi
 *     tags: [Prodi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               abbreviation:
 *                 type: string
 *               degree:
 *                 type: string
 *     responses:
 *       200:
 *         description: Program studi berhasil diperbarui
 *       400:
 *         description: Data tidak valid
 *       404:
 *         description: Program studi tidak ditemukan
 */
export const updateProdiHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const prodi = await prodiService.updateProdi(req.params.id as string, req.body);
    successResponse(res, prodi, 'Program studi berhasil diperbarui');
  } catch (err: any) {
    const message = err.message;
    const code = message.includes('tidak ditemukan') ? 404 : 400;
    errorResponse(res, message, code);
  }
};

/**
 * @swagger
 * /api/prodi/{id}/accreditation:
 *   get:
 *     summary: Mendapatkan informasi akreditasi program studi
 *     tags: [Prodi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Data akreditasi berhasil diambil
 *       404:
 *         description: Program studi tidak ditemukan
 */
export const getAccreditationHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const accreditation = await prodiService.getAccreditation(req.params.id as string);
    successResponse(res, accreditation, 'Data akreditasi berhasil diambil');
  } catch (err: any) {
    const code = err.message.includes('tidak ditemukan') ? 404 : 500;
    errorResponse(res, err.message, code);
  }
};

/**
 * @swagger
 * /api/prodi/{id}/accreditation:
 *   put:
 *     summary: Membuat atau memperbarui informasi akreditasi program studi
 *     tags: [Prodi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               grade:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               certificateUrl:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Data akreditasi berhasil disimpan
 *       400:
 *         description: Data tidak valid
 *       404:
 *         description: Program studi tidak ditemukan
 */
export const upsertAccreditationHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const accreditation = await prodiService.upsertAccreditation(req.params.id as string, req.body);
    successResponse(res, accreditation, 'Data akreditasi berhasil disimpan');
  } catch (err: any) {
    const message = err.message;
    const code = message.includes('tidak ditemukan') ? 404 : 400;
    errorResponse(res, message, code);
  }
};

/**
 * @swagger
 * /api/prodi/{prodiId}/dashboard:
 *   get:
 *     summary: Mendapatkan dashboard per prodi
 *     tags: [Prodi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: prodiId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID program studi
 *     responses:
 *       200:
 *         description: Dashboard data berhasil diambil
 *       404:
 *         description: Program studi tidak ditemukan
 */
export const getDashboardByProdiHandler = async (req: Request, res: Response): Promise<void> => {
  const prodiId = String(req.params.prodiId);
  const accessInfo = (req as any).prodiAccessInfo;

  try {
    const dashboard = await prodiService.getDashboardByProdi(prodiId);
    successResponse(res, { ...dashboard, accessInfo }, 'Dashboard prodi berhasil diambil');
  } catch (err: any) {
    const message = err?.message || 'Gagal mengambil dashboard prodi';
    const code = message.includes('tidak ditemukan') ? 404 : 500;
    errorResponse(res, message, code);
  }
};

/**
 * @swagger
 * /api/prodi/{prodiId}/dashboard:
 *   put:
 *     summary: Mengupdate dashboard per prodi
 *     tags: [Prodi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: prodiId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID program studi
 *     responses:
 *       200:
 *         description: Dashboard berhasil diupdate
 *       404:
 *         description: Program studi tidak ditemukan
 */
export const updateDashboardByProdiHandler = async (req: Request, res: Response): Promise<void> => {
  const prodiId = String(req.params.prodiId);
  const { documentLKPS, documentLED, accreditationInfo } = req.body;

  try {
    const updatedDashboard = await prodiService.updateDashboardByProdi(prodiId, {
      documentLKPS,
      documentLED,
      accreditationInfo,
    });

    successResponse(res, updatedDashboard, 'Dashboard prodi berhasil diupdate');
  } catch (err: any) {
    const message = err?.message || 'Gagal mengupdate dashboard prodi';
    const code = message.includes('tidak ditemukan') ? 404 : 
      message.includes('tidak boleh') ? 400 : 500;
    errorResponse(res, message, code);
  }
};

export const getInstitusiDashboardSummaryHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const summary = await prodiService.getInstitusiDashboardSummary();
    successResponse(res, summary, 'Ringkasan dashboard institusi berhasil diambil');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
};

export const uploadCertificateHandler = async (req: Request, res: Response): Promise<void> => {
  const prodiId = req.params.id as string;
  const file = req.file;

  if (!file) {
    errorResponse(res, 'File sertifikat tidak ditemukan dalam request', 400);
    return;
  }

  try {
    const accreditation = await prodiService.uploadAccreditationCertificate(prodiId, file);
    successResponse(res, accreditation, 'Sertifikat akreditasi berhasil diunggah');
  } catch (err: any) {
    const message = err.message;
    const code = message.includes('tidak ditemukan') ? 404 : 500;
    errorResponse(res, message, code);
  }
};

export const getCertificateFileHandler = async (req: Request, res: Response): Promise<void> => {
  const prodiId = req.params.id as string;

  try {
    const accreditation = await prodiService.getAccreditation(prodiId);
    if (!accreditation?.certificateUrl) {
      errorResponse(res, 'Sertifikat tidak tersedia', 404);
      return;
    }

    const { storageProvider } = await import('../utils/storage');
    const buffer = await storageProvider.downloadFile(accreditation.certificateUrl, 'accreditation');
    
    const originalName = accreditation.certificateOriginalName ?? 'sertifikat';
    const encodedName = encodeURIComponent(originalName);
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedName}`);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(buffer);
  } catch (err: any) {
    const code = err.message.includes('tidak ditemukan') ? 404 : 500;
    errorResponse(res, err.message, code);
  }
};