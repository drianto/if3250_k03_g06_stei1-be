import { Router } from 'express';
import multer from 'multer';
import {
  previewLKPSHandler,
  confirmLKPSHandler,
  getLKPSHistoryHandler,
  exportLKPSHandler,
  getLKPSDocumentHandler,
  updateLKPSDocumentHandler,
  getLKPSSheetHandler,
  updateLKPSSheetHandler,
  completeSheetHandler,
  getSheetConfigHandler,
  getSheetsByProgramHandler,
  getDocumentSheetsHandler,
  autoSaveLKPSSheetHandler,
  saveLKPSDocumentAsDraftHandler,
  finalizeLKPSDocumentHandler,
  toggleLKPSStatusHandler,
  getProdiFormatHandler,
  deleteLKPSDocumentHandler,
} from '../controllers/lkps.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';
import { requireResourceAccess } from '../middlewares/resourceAccess.middleware';
import { Role } from '@prisma/client';

const router = Router();

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } 
});

/**
 * @swagger
 * tags:
 *   name: LKPS
 *   description: Manajemen Laporan Kinerja Program Studi
 */

router.use(authenticate);

// 1. Helper routes (get config, sheets by program, etc) - BEFORE specific ID routes
router.get('/config/:sheetName', getSheetConfigHandler);
router.get('/sheets-by-program/:programType', getSheetsByProgramHandler);
router.get('/format/:prodiId', requireResourceAccess('prodi', 'read', 'prodiId'), getProdiFormatHandler);
router.get('/document/:documentId/sheets', requireResourceAccess('lkps_document', 'read', 'documentId'), getDocumentSheetsHandler);

// 2. Sheet-level operations (must be before document routes to avoid conflicts)
router.get('/sheet/:criteriaId/:sheetName', requireResourceAccess('lkps_criteria', 'read', 'criteriaId'), getLKPSSheetHandler);
router.put('/sheet/:criteriaId/:sheetName', requireResourceAccess('lkps_criteria', 'write', 'criteriaId'), updateLKPSSheetHandler);
router.put('/sheet/:criteriaId/:sheetName/autosave', requireResourceAccess('lkps_criteria', 'write', 'criteriaId'), autoSaveLKPSSheetHandler);
router.post('/sheet/:criteriaId/:sheetName/complete', requireResourceAccess('lkps_criteria', 'write', 'criteriaId'), completeSheetHandler);

// 3. Document-level operations (save draft, finalize)
router.post('/document/:documentId/save-draft', requireResourceAccess('lkps_document', 'write', 'documentId'), saveLKPSDocumentAsDraftHandler);
router.post('/document/:documentId/finalize', requireResourceAccess('lkps_document', 'write', 'documentId'), finalizeLKPSDocumentHandler);
router.put('/document/status/:id', requireResourceAccess('lkps_document', 'write', 'id'), requireRole(Role.SUPER_ADMIN, Role.KAPRODI), toggleLKPSStatusHandler);

// 4. Get/Update Single Document (Matches UUIDs, prioritized over history/export)
router.get('/:id', requireResourceAccess('lkps_document', 'read', 'id'), getLKPSDocumentHandler);
router.put('/:id', requireResourceAccess('lkps_document', 'write', 'id'), updateLKPSDocumentHandler);
router.delete('/:id', requireResourceAccess('lkps_document', 'write', 'id'), deleteLKPSDocumentHandler);

// 5. High priority fixed routes
router.post('/preview', upload.single('file'), previewLKPSHandler);
router.post('/confirm', upload.single('file'), confirmLKPSHandler);

// 6. History and Export
router.get('/history/:prodiId', requireResourceAccess('prodi', 'read', 'prodiId'), getLKPSHistoryHandler);
router.get('/export/:id', requireResourceAccess('lkps_document', 'read', 'id'), exportLKPSHandler);

export default router;
