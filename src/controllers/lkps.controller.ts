import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response';
import { parseLKPSExcel } from '../parsers/lkps.parser';
import * as lkpsService from '../services/lkps.service';
import prisma from '../config/database.config';
import { getSheetConfig, LKPS_SHEETS, getSheetsByFormat, LKPSFormat } from '../config/lkps.config';
import path from 'path';
import fs from 'fs';

/**
 * @swagger
 * /api/lkps/preview:
 *   post:
 *     summary: Preview file Excel LKPS sebelum diupload
 *     description: Memparsing file Excel dan mengembalikan data dalam format JSON untuk direview user
 *     tags: [LKPS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Berhasil memparsing file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   description: Data yang sudah diparsing dari Excel
 *                 message:
 *                   type: string
 *       400:
 *         description: File tidak ditemukan
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Gagal memparsing file
 */
export const previewLKPSHandler = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return errorResponse(res, 'File tidak ditemukan', 400);
    }

    const data = await parseLKPSExcel(file.buffer);
    return successResponse(res, data, 'Berhasil memparsing file LKPS');
  } catch (error: any) {
    console.error('Error previewing LKPS:', error);
    try { require('fs').appendFileSync('debug-error.log', new Date().toISOString() + ' PREVIEW ERROR\\n' + (error.stack || error.message || String(error)) + '\\n\\n'); } catch (e) {}
    return errorResponse(res, 'Gagal memparsing file LKPS', 500);
  }
};

/**
 * @swagger
 * /api/lkps/confirm:
 *   post:
 *     summary: Konfirmasi dan simpan dokumen LKPS
 *     description: Menyimpan data LKPS yang sudah diparsing ke database dan menyimpan file fisiknya
 *     tags: [LKPS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               prodiId:
 *                 type: string
 *                 format: id
 *               periode:
 *                 type: string
 *                 example: "2024"
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Berhasil menyimpan dokumen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: Data tidak lengkap
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Gagal mengupload LKPS
 */
export const confirmLKPSHandler = async (req: Request, res: Response) => {
  try {
    const { prodiId, name, periode } = req.body;
    const file = req.file;
    
    let targetProdiId = (prodiId as string) || (req.user as any)?.prodiId;

    if (!targetProdiId && (req.user as any)?.role === 'SUPER_ADMIN') {
      const firstProdi = await prisma.prodi.findFirst();
      if (firstProdi) {
        targetProdiId = firstProdi.id;
      }
    }

    if (!targetProdiId || !file) {
      return errorResponse(res, 'File atau Program studi tidak ditemukan', 400);
    }

    // Detect LKPS format from prodi name
    const prodi = await prisma.prodi.findUnique({ where: { id: targetProdiId } });
    const lkpsFormat: LKPSFormat = (prodi?.category === 'INFOKOM') ? 'INFOKOM' : 'TEKNIK';

    let parsedData = {};
    try {
      parsedData = await parseLKPSExcel(file.buffer, lkpsFormat);
    } catch (parseError) {
      console.error('Failed to parse LKPS content on confirm:', parseError);
      return errorResponse(res, 'Gagal memparsing file LKPS', 400);
    }

    const { storageProvider } = await import('../utils/storage');
    const savedFilename = await storageProvider.upload(file, 'lkps');
    const originalFilename = file.originalname;

    const document = await lkpsService.importLKPS(
      targetProdiId, 
      parsedData, 
      name || `LKPS - ${originalFilename}`, 
      savedFilename,
      originalFilename,
      periode?.toString(),
      lkpsFormat
    );

    const fullDocument = await lkpsService.getLKPSDocumentById(document.id);
    
    return successResponse(res, fullDocument, 'LKPS berhasil diupload dan disimpan', 201);
  } catch (error: any) {
    console.error('Error uploading LKPS:', error);
    try { require('fs').appendFileSync('debug-error.log', new Date().toISOString() + '\\n' + (error.stack || error.message || String(error)) + '\\n\\n'); } catch (e) {}
    if (error.message?.includes('Validasi')) {
      return errorResponse(res, error.message, 400);
    }
    return errorResponse(res, 'Gagal mengupload LKPS', 500);
  }
};
// export const confirmLKPSHandler = async (req: Request, res: Response) => {
//   try {
//     const { prodiId, name, periode } = req.body;
//     const file = req.file;
    
//     let targetProdiId = (prodiId as string) || (req.user as any)?.prodiId;

//     if (!targetProdiId && (req.user as any)?.role === 'SUPER_ADMIN') {
//       const firstProdi = await prisma.prodi.findFirst();
//       if (firstProdi) {
//         targetProdiId = firstProdi.id;
//       }
//     }

//     if (!targetProdiId || !file) {
//       return errorResponse(res, 'File atau Program studi tidak ditemukan', 400);
//     }

//     const uploadDir = path.join(process.cwd(), 'uploads', 'lkps');
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     const originalFilename = file.originalname;
//     const fileExt = path.extname(originalFilename);
//     const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
//     const filePath = path.join('uploads', 'lkps', uniqueFilename);
//     const fullPath = path.join(process.cwd(), filePath);
    
//     fs.writeFileSync(fullPath, file.buffer);

//     // Parse the file to get data
//     let parsedData = {};
//     try {
//       parsedData = await parseLKPSExcel(file.buffer);
//     } catch (parseError) {
//       console.error('Failed to parse LKPS content on confirm:', parseError);
//       return errorResponse(res, 'Gagal memparsing file LKPS', 400);
//     }

//     // Import LKPS in a single transaction
//     const document = await lkpsService.importLKPS(
//       targetProdiId, 
//       parsedData, 
//       name || `LKPS - ${originalFilename}`, 
//       filePath, 
//       originalFilename,
//       periode?.toString()
//     );

//     // Return created document with all related data
//     const fullDocument = await lkpsService.getLKPSDocumentById(document.id);
    
//     return successResponse(res, fullDocument, 'LKPS berhasil diupload dan disimpan', 201);
//   } catch (error: any) {
//     console.error('Error uploading LKPS:', error);
//     // Check if error is validation error
//     if (error.message?.includes('Validasi')) {
//       return errorResponse(res, error.message, 400);
//     }
//     return errorResponse(res, 'Gagal mengupload LKPS', 500);
//   }
// };

/**
 * @swagger
 * /api/lkps/history/{prodiId}:
 *   get:
 *     summary: Mendapatkan riwayat dokumen LKPS untuk program studi tertentu
 *     description: Mengambil semua dokumen LKPS yang pernah dibuat oleh suatu program studi, diurutkan dari terbaru hingga terlama
 *     tags: [LKPS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: prodiId
 *         required: true
 *         schema:
 *           type: string
 *           format: id
 *         description: ID program studi untuk mengambil riwayat dokumentnya
 *     responses:
 *       200:
 *         description: Berhasil mengambil riwayat
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Gagal mengambil riwayat
 */
export const getLKPSHistoryHandler = async (req: Request, res: Response) => {
  try {
    const prodiId = req.params.prodiId as string;
    const history = await lkpsService.getLKPSHistoryByProdi(prodiId);
    return successResponse(res, history, 'Berhasil mengambil riwayat LKPS');
  } catch (error: any) {
    console.error('Error getting history:', error);
    return errorResponse(res, 'Gagal mengambil riwayat', 500);
  }
};

/**
 * @swagger
 * /api/lkps/{id}:
 *   get:
 *     summary: Mendapatkan detail satu dokumen LKPS
 *     description: Mengambil data satu dokumen LKPS berdasarkan ID, termasuk konten datanya
 *     tags: [LKPS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: id
 *         description: ID dokumen LKPS
 *     responses:
 *       200:
 *         description: Dokumen berhasil diambil
 *       404:
 *         description: Dokumen tidak ditemukan
 *       500:
 *         description: Gagal mengambil dokumen
 */
export const getLKPSDocumentHandler = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const document = await lkpsService.getLKPSDocumentById(id);
    
    if (!document) {
      return errorResponse(res, 'Dokumen tidak ditemukan', 404);
    }
    
    return successResponse(res, document, 'Berhasil mengambil dokumen LKPS');
  } catch (error: any) {
    console.error('Error getting document:', error);
    return errorResponse(res, 'Gagal mengambil dokumen', 500);
  }
};

/**
 * @swagger
 * /api/lkps/{id}:
 *   put:
 *     summary: Update konten dokumen LKPS
 *     description: Memperbarui data JSON konten di dalam dokumen LKPS
 *     tags: [LKPS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: id
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: object
 *     responses:
 *       200:
 *         description: Dokumen berhasil diperbarui
 *       404:
 *         description: Dokumen tidak ditemukan
 *       500:
 *         description: Gagal memperbarui dokumen
 */
export const updateLKPSDocumentHandler = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { content } = req.body;

    const document = await lkpsService.getLKPSDocumentById(id);
    if (!document) {
      return errorResponse(res, 'Dokumen tidak ditemukan', 404);
    }

    if (document.status === 'FINAL') {
      return errorResponse(res, 'Dokumen LKPS telah dikunci (FINAL) dan tidak dapat diubah.', 403);
    }

    const updatedDocument = await prisma.documentLKPS.update({
      where: { id },
      data: { content },
    });

    return successResponse(res, updatedDocument, 'Data LKPS berhasil diperbarui');
  } catch (error: any) {
    console.error('Error updating document:', error);
    return errorResponse(res, 'Gagal memperbarui data LKPS', 500);
  }
};

/**
 * @swagger
 * /api/lkps/export/{id}:
 *   get:
 *     summary: Mengekspor dokumen LKPS sebagai file Excel
 *     description: Mengambil dokumen LKPS dari database dan mengirimnya sebagai file Excel untuk diunduh
 *     tags: [LKPS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: id
 *         description: ID dokumen LKPS yang akan diunduh
 *     responses:
 *       200:
 *         description: File Excel LKPS berhasil digenerate dan siap diunduh
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Dokumen tidak ditemukan
 *       500:
 *         description: Gagal mengekspor LKPS
 */
export const exportLKPSHandler = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const document = await lkpsService.getLKPSDocumentById(id) as any;

    if (!document) {
      return errorResponse(res, 'Dokumen tidak ditemukan', 404);
    }

    if (document.filePath) {
      try {
        const { storageProvider } = await import('../utils/storage');
        const buffer = await storageProvider.downloadFile(document.filePath, 'lkps');
        
        // Remove password protection from the original uploaded file
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        workbook.eachSheet((sheet: any) => {
          if (sheet.properties) {
            delete sheet.properties.sheetProtection;
          }
          if (sheet.views) {
            sheet.views = sheet.views.map((view: any) => ({ ...view, state: 'normal' }));
          }
        });
        const unprotectedBuffer = await workbook.xlsx.writeBuffer();
        
        const encodedName = encodeURIComponent(document.originalFilename || 'LKPS.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedName}`);
        
        return res.send(unprotectedBuffer);
      } catch (storageError) {
        console.warn('File fisik LKPS tidak ditemukan di storage, mencoba generate ulang dari JSON...', storageError);
      }
    }

    if (!document.content) {
      return errorResponse(res, 'Data dokumen tidak lengkap', 404);
    }

    const { generateLKPSExcel } = require('../exporters/lkps.exporter');
    const buffer = await generateLKPSExcel(document.content);
    
    const encodedName = encodeURIComponent(`LKPS_${document.prodi?.abbreviation || 'Export'}.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedName}`);
    
    return res.send(buffer);
  } catch (error: any) {
    console.error('Error exporting LKPS:', error);
    return errorResponse(res, 'Gagal mengekspor LKPS', 500);
  }
};
// export const exportLKPSHandler = async (req: Request, res: Response) => {
//   try {
//     const id = req.params.id as string;
//     const document = await lkpsService.getLKPSDocumentById(id) as any;

//     if (!document) {
//       return errorResponse(res, 'Dokumen tidak ditemukan', 404);
//     }

//     if (document.filePath) {
//       const fullPath = path.join(process.cwd(), document.filePath);
//       if (fs.existsSync(fullPath)) {
//         res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//         res.setHeader('Content-Disposition', `attachment; filename="${document.originalFilename || 'LKPS.xlsx'}"`);
//         return res.sendFile(fullPath);
//       }
//     }

//     if (!document.content) {
//       return errorResponse(res, 'Data dokumen tidak lengkap', 404);
//     }

//     const { generateLKPSExcel } = require('../exporters/lkps.exporter');
//     const buffer = await generateLKPSExcel(document.content);
    
//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', `attachment; filename="LKPS_${document.prodi?.abbreviation || 'Export'}.xlsx"`);
    
//     return res.send(buffer);
//   } catch (error: any) {
//     console.error('Error exporting LKPS:', error);
//     return errorResponse(res, 'Gagal mengekspor LKPS', 500);
//   }
// };

/**
 * @swagger
 * /api/lkps/sheet/{criteriaId}/{sheetName}:
 *   get:
 *     summary: Get data from specific LKPS sheet
 *     description: Retrieve data from a specific sheet within a criteria
 *     tags: [LKPS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: criteriaId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: sheetName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sheet data retrieved successfully
 *       404:
 *         description: Sheet not found
 *       500:
 *         description: Failed to get sheet data
 */
export const getLKPSSheetHandler = async (req: Request, res: Response) => {
  try {
    const criteriaId = req.params.criteriaId as string;
    const sheetName = req.params.sheetName as string;
    
    const sheetData = await lkpsService.getLKPSSheetData(criteriaId, sheetName);
    
    if (!sheetData) {
      return errorResponse(res, 'Sheet tidak ditemukan', 404);
    }
    
    return successResponse(res, sheetData, 'Berhasil mengambil data sheet');
  } catch (error: any) {
    console.error('Error getting sheet:', error);
    return errorResponse(res, 'Gagal mengambil data sheet', 500);
  }
};

/**
 * @swagger
 * /api/lkps/sheet/{criteriaId}/{sheetName}:
 *   put:
 *     summary: Update LKPS sheet data
 *     description: Update data in a specific sheet
 *     tags: [LKPS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: criteriaId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: sheetName
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Sheet data updated successfully
 *       404:
 *         description: Sheet not found
 *       500:
 *         description: Failed to update sheet data
 */
export const updateLKPSSheetHandler = async (req: Request, res: Response) => {
  try {
    const criteriaId = req.params.criteriaId as string;
    const sheetName = req.params.sheetName as string;
    const { data } = req.body;
    
    if (!Array.isArray(data)) {
      return errorResponse(res, 'Data harus berupa array', 400);
    }
    
    const updated = await lkpsService.updateLKPSSheetData(criteriaId, sheetName, data);
    
    return successResponse(res, updated, 'Data sheet berhasil diperbarui');
  } catch (error: any) {
    console.error('Error updating sheet:', error);
    // Check if error is validation error
    if (error.message?.includes('Validasi')) {
      return errorResponse(res, error.message, 400);
    }
    return errorResponse(res, 'Gagal memperbarui data sheet', 500);
  }
};

/**
 * @swagger
 * /api/lkps/sheet/{criteriaId}/{sheetName}/complete:
 *   post:
 *     summary: Mark LKPS sheet as completed
 *     description: Mark a sheet as completed for this criteria
 *     tags: [LKPS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: criteriaId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: sheetName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sheet marked as completed
 *       404:
 *         description: Sheet not found
 *       500:
 *         description: Failed to mark sheet as completed
 */
export const completeSheetHandler = async (req: Request, res: Response) => {
  try {
    const criteriaId = req.params.criteriaId as string;
    const sheetName = req.params.sheetName as string;
    
    const updated = await lkpsService.markSheetCompleted(criteriaId, sheetName);
    
    return successResponse(res, updated, 'Sheet berhasil ditandai selesai');
  } catch (error: any) {
    console.error('Error completing sheet:', error);
    const code = error.message.includes('tidak ditemukan') ? 404 : 500;
    return errorResponse(res, error.message || 'Gagal menandai sheet selesai', code);
  }
};

/**
 * @swagger
 * /api/lkps/config/{sheetName}:
 *   get:
 *     summary: Get LKPS sheet configuration
 *     description: Retrieve column definitions, row types, and metadata for a specific sheet
 *     tags: [LKPS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sheetName
 *         required: true
 *         schema:
 *           type: string
 *         description: Sheet name (e.g., "1", "2a1", "3a1")
 *     responses:
 *       200:
 *         description: Sheet configuration retrieved
 *       404:
 *         description: Sheet configuration not found
 *       500:
 *         description: Failed to get configuration
 */
export const getSheetConfigHandler = async (req: Request, res: Response) => {
  try {
    const sheetName = req.params.sheetName as string;
    const format = (req.query.format as LKPSFormat) || 'INFOKOM';
    
    const config = getSheetConfig(sheetName, format);
    if (!config) {
      return errorResponse(res, `Sheet "${sheetName}" tidak ditemukan`, 404);
    }
    
    return successResponse(res, config, 'Berhasil mengambil konfigurasi sheet');
  } catch (error: any) {
    console.error('Error getting sheet config:', error);
    return errorResponse(res, 'Gagal mengambil konfigurasi sheet', 500);
  }
};

/**
 * @swagger
 * /api/lkps/sheets-by-program/{programType}:
 *   get:
 *     summary: Get applicable sheets for a program type
 *     description: Retrieve all sheet names and configurations applicable to a specific program type (D1, D2, D3, S, STr, M, MTr, D, DTr, PSPPI)
 *     tags: [LKPS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: programType
 *         required: true
 *         schema:
 *           type: string
 *         description: Program type (e.g., "S", "D3", "PSPPI")
 *     responses:
 *       200:
 *         description: Applicable sheets retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       sheetName:
 *                         type: string
 *                       sheetTitle:
 *                         type: string
 *                       criteriaCode:
 *                         type: string
 *       400:
 *         description: Invalid program type
 *       500:
 *         description: Failed to get sheets
 */
export const getSheetsByProgramHandler = async (req: Request, res: Response) => {
  try {
    const programType = req.params.programType as string;
    
    // Validate program type
    const validPrograms = ['D1', 'D2', 'D3', 'S', 'STr', 'M', 'MTr', 'D', 'DTr', 'PSPPI'];
    if (!validPrograms.includes(programType)) {
      return errorResponse(
        res,
        `Program type tidak valid. Pilihan: ${validPrograms.join(', ')}`,
        400
      );
    }
    
    // Get all applicable sheets
    const applicableSheets = Object.entries(LKPS_SHEETS)
      .filter(([_, config]) => config.applicableTo.includes(programType))
      .map(([sheetName, config]) => ({
        sheetName: config.sheetName,
        sheetTitle: config.sheetTitle,
        criteriaCode: config.criteriaCode,
        rowType: config.rowType,
        columns: config.columns.length,
      }));
    
    return successResponse(
      res,
      applicableSheets,
      `Berhasil mengambil ${applicableSheets.length} sheet untuk program ${programType}`
    );
  } catch (error: any) {
    console.error('Error getting sheets by program:', error);
    return errorResponse(res, 'Gagal mengambil daftar sheet', 500);
  }
};

/**
 * @swagger
 * /api/lkps/document/{documentId}/sheets:
 *   get:
 *     summary: Get all sheets in a document
 *     description: Retrieve all sheet names and their completion status for a document
 *     tags: [LKPS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *         description: LKPS document ID
 *     responses:
 *       200:
 *         description: Document sheets retrieved
 *       404:
 *         description: Document not found
 *       500:
 *         description: Failed to get sheets
 */
export const getDocumentSheetsHandler = async (req: Request, res: Response) => {
  try {
    const documentId = req.params.documentId as string;
    
    // Verify document exists
    const document = await lkpsService.getLKPSDocumentById(documentId);
    if (!document) {
      return errorResponse(res, 'Dokumen tidak ditemukan', 404);
    }
    
    // Build sheet list with completion status
    const sheetList = document.criterias.flatMap((criteria: any) =>
      criteria.sheets.map((sheet: any) => ({
        sheetName: sheet.sheetName,
        sheetTitle: sheet.sheetTitle,
        criteriaId: criteria.id,
        criteriaCode: criteria.criteriaCode,
        criteriaName: criteria.criteriaName,
        isCompleted: sheet.isCompleted,
        createdAt: sheet.createdAt,
        updatedAt: sheet.updatedAt,
      }))
    );
    
    return successResponse(
      res,
      {
        documentId,
        totalSheets: sheetList.length,
        completedSheets: sheetList.filter((s: any) => s.isCompleted).length,
        sheets: sheetList,
      },
      'Berhasil mengambil daftar sheet dokumen'
    );
  } catch (error: any) {
    console.error('Error getting document sheets:', error);
    return errorResponse(res, 'Gagal mengambil daftar sheet', 500);
  }
};

/**
 * @swagger
 * /api/lkps/sheet/{criteriaId}/{sheetName}/autosave:
 *   put:
 *     summary: Auto-save LKPS sheet data (lightweight)
 *     description: Quick auto-save without full validation - for real-time updates
 *     tags: [LKPS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: criteriaId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: sheetName
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Auto-save successful
 *       400:
 *         description: Invalid data format
 *       500:
 *         description: Failed to auto-save
 */
export const autoSaveLKPSSheetHandler = async (req: Request, res: Response) => {
  try {
    const criteriaId = req.params.criteriaId as string;
    const sheetName = req.params.sheetName as string;
    const { data } = req.body;
    
    if (!Array.isArray(data)) {
      return errorResponse(res, 'Data harus berupa array', 400);
    }
    
    const updated = await lkpsService.autoSaveLKPSSheetData(criteriaId, sheetName, data);
    
    return successResponse(res, updated, 'Data sheet auto-saved');
  } catch (error: any) {
    console.error('Error auto-saving sheet:', error);
    return errorResponse(res, 'Gagal auto-save data sheet', 500);
  }
};

/**
 * @swagger
 * /api/lkps/document/{documentId}/save-draft:
 *   post:
 *     summary: Save LKPS document as draft
 *     description: Explicitly save the entire document as draft status
 *     tags: [LKPS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document saved as draft
 *       404:
 *         description: Document not found
 *       500:
 *         description: Failed to save document
 */
export const saveLKPSDocumentAsDraftHandler = async (req: Request, res: Response) => {
  try {
    const documentId = req.params.documentId as string;
    
    // Verify document exists
    const document = await lkpsService.getLKPSDocumentById(documentId);
    if (!document) {
      return errorResponse(res, 'Dokumen tidak ditemukan', 404);
    }
    
    const updated = await lkpsService.saveLKPSDocumentAsDraft(documentId);
    
    return successResponse(res, updated, 'Dokumen LKPS berhasil disimpan sebagai draft');
  } catch (error: any) {
    console.error('Error saving document as draft:', error);
    return errorResponse(res, 'Gagal menyimpan dokumen', 500);
  }
};

/**
 * @swagger
 * /api/lkps/document/{documentId}/finalize:
 *   post:
 *     summary: Finalize LKPS document (submit as final)
 *     description: Mark document as final status - requires all mandatory sheets to be completed
 *     tags: [LKPS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document finalized successfully
 *       404:
 *         description: Document not found
 *       400:
 *         description: Cannot finalize - missing required sheets
 *       500:
 *         description: Failed to finalize document
 */
export const finalizeLKPSDocumentHandler = async (req: Request, res: Response) => {
  try {
    const documentId = req.params.documentId as string;
    const user = req.user as any; // <-- AMBIL DATA USER
    
    // Verify document exists
    const document = await lkpsService.getLKPSDocumentById(documentId);
    if (!document) {
      return errorResponse(res, 'Dokumen tidak ditemukan', 404);
    }

    // Validasi Akses Kaprodi
    if (user.role === 'KAPRODI' && document.prodiId !== user.prodiId) {
      return errorResponse(res, 'Akses ditolak: Anda hanya dapat memfinalisasi dokumen prodi Anda sendiri', 403);
    }
    
    // Check if all sheets are completed
    const allSheets = document.criterias.flatMap((c: any) => c.sheets);
    const hasData = allSheets.length > 0;
    
    if (!hasData) {
      return errorResponse(res, 'Tidak ada data sheet dalam dokumen', 400);
    }
    
    const updated = await lkpsService.finalizeLKPSDocument(documentId, user.userId); 
    
    return successResponse(res, updated, 'Dokumen LKPS berhasil difinalisasi');
  } catch (error: any) {
    console.error('Error finalizing document:', error);
    return errorResponse(res, error.message || 'Gagal memfinalisasi dokumen', 500);
  }
};


export const toggleLKPSStatusHandler = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body; // 'DRAFT' atau 'FINAL'
    const user = req.user as any;

    const document = await lkpsService.getLKPSDocumentById(id);
    if (!document) return errorResponse(res, 'Dokumen tidak ditemukan', 404);

    // Validasi Akses Kaprodi
    if (user.role === 'KAPRODI' && document.prodiId !== user.prodiId) {
      return errorResponse(res, 'Akses ditolak: Anda hanya dapat mengunci dokumen prodi Anda sendiri', 403);
    }

    const updated = await lkpsService.toggleLKPSStatus(id, status, user.userId);
    return successResponse(res, updated, `Dokumen berhasil diubah menjadi ${status}`);
  } catch (error: any) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Get LKPS format (INFOKOM | TEKNIK) for a prodi based on its category
 */
export const getProdiFormatHandler = async (req: Request, res: Response) => {
  try {
    const prodiId = req.params.prodiId as string;
    
    // Validate that user has access to this prodi (handled by middleware)
    
    const prodi = await prisma.prodi.findUnique({
      where: { id: prodiId },
      select: { category: true, fullname: true }
    });
    
    if (!prodi) {
      return errorResponse(res, 'Prodi tidak ditemukan', 404);
    }
    
    // Valid categories are INFOKOM and TEKNIK
    const format = (prodi.category === 'INFOKOM') ? 'INFOKOM' : 'TEKNIK';
    
    return successResponse(res, { format, prodiName: prodi.fullname }, 'Berhasil mendapatkan format prodi');
  } catch (error: any) {
    console.error('Error getting prodi format:', error);
    return errorResponse(res, 'Gagal mengambil format prodi', 500);
  }
};

export const deleteLKPSDocumentHandler = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await lkpsService.deleteLKPSDocument(id);
    return successResponse(res, null, 'Berhasil menghapus dokumen LKPS');
  } catch (error: any) {
    console.error('Error deleting LKPS:', error);
    if (error.message.includes('FINAL')) {
      return errorResponse(res, error.message, 400);
    }
    return errorResponse(res, 'Gagal menghapus dokumen LKPS', 500);
  }
};
