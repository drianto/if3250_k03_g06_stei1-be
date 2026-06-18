import prisma from '../config/database.config';
import { DocumentStatus } from '@prisma/client';
import { LKPS_KRITERIA, getSheetConfig, LKPSFormat } from '../config/lkps.config';
import { validateSheetData } from '../validators/lkps.validator';
import { generateEarlyWarnings } from './notification.service';
import { syncAllInstitusiToDocument } from './institusi.service';

export const createLKPSDocument = async (
  prodiId: string,
  content: any,
  name?: string,
  filePath?: string,
  originalFilename?: string,
  periode?: string,
  tx?: any
) => {
  const client = tx || prisma;
  const latestDoc = await client.documentLKPS.findFirst({
    where: { 
      prodiId, 
      periode 
    },
    orderBy: { 
      versi: 'desc' 
    },
  });

  const newVersi = latestDoc ? latestDoc.versi + 1 : 1;

  return await client.documentLKPS.create({
    data: {
      prodiId,
      content,
      name: name || `LKPS ${periode || new Date().getFullYear()} - Versi ${newVersi}`,
      status: DocumentStatus.DRAFT,
      versi: newVersi,
      filePath,
      originalFilename,
      periode,
    } as any,
  });
};

export const getLKPSHistory = async (prodiId: string): Promise<any[]> => {
  return await prisma.documentLKPS.findMany({
    where: { prodiId },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Mendapatkan daftar periode yang tersedia untuk sebuah Prodi
 */
export const getAvailablePeriods = async (prodiId: string): Promise<string[]> => {
  const docs = await prisma.documentLKPS.findMany({
    where: { 
      prodiId,
      status: DocumentStatus.DRAFT
    },
    select: { periode: true },
    distinct: ['periode'],
  });

  const periods = new Set(docs.map((d) => d.periode).filter((p): p is string => p !== null));
  return Array.from(periods).sort().reverse();
};

export const getLKPSHistoryByProdi = async (prodiId: string) => {
  return await prisma.documentLKPS.findMany({
    where: {
      prodiId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      prodi: {
        select: {
          fullname: true,
        },
      },
    },
  });
};

export const getLKPSDocumentById = async (id: string) => {
  return await prisma.documentLKPS.findUnique({
    where: { id },
    include: {
      prodi: true,
      criterias: {
        include: {
          sheets: true,
        },
      },
    },
  });
};

/**
 * Helper: Cek apakah dokumen LKPS dikunci (FINAL)
 */
const checkLKPSLock = async (criteriaId: string) => {
  const criteria = await prisma.lKPSCriteria.findUnique({
    where: { id: criteriaId },
    include: { document: true }
  });
  if (criteria?.document?.status === 'FINAL') {
    throw new Error('Dokumen LKPS telah dikunci (FINAL) dan tidak dapat diubah.');
  }
};

/**
 * Create single LKPS Kriteria
 */
export const createLKPSCriteria = async (
  documentId: string,
  criteriaCode: string,
  criteriaName: string,
  subCriteriaCode?: string | null,
  subCriteriaName?: string | null,
  tx?: any
) => {
  const client = tx || prisma;
  return await client.lKPSCriteria.create({
    data: {
      documentId,
      criteriaCode,
      criteriaName,
      subCriteriaCode: subCriteriaCode || null,
      subCriteriaName: subCriteriaName || null,
      isCompleted: false,
    },
  });
};

/**
 * Create all 7 LKPS Kriteria for a document
 */
export const createAllLKPSCriteria = async (documentId: string, tx?: any) => {
  const kriteriaIds: Record<string, string> = {};
  
  for (const [code, kriteriaInfo] of Object.entries(LKPS_KRITERIA)) {
    const created = await createLKPSCriteria(
      documentId,
      code,
      kriteriaInfo.name,
      null,
      null,
      tx
    );
    kriteriaIds[code] = created.id;
  }
  
  return kriteriaIds;
};

/**
 * Create single LKPS Sheet Data
 */
export const createLKPSSheetData = async (
  criteriaId: string,
  sheetName: string,
  sheetTitle: string,
  data: any[],
  tx?: any
) => {
  const client = tx || prisma;
  const validation = validateSheetData(sheetName, data);
  if (!validation.valid) {
    throw new Error(`Validasi data sheet "${sheetName}" gagal:\n${validation.errors.join('\n')}`);
  }

  return await client.lKPSSheetData.create({
    data: {
      criteriaId,
      sheetName,
      sheetTitle,
      data,
      isCompleted: false,
    },
  });
};

/**
 * Create multiple sheet data entries from parsed data
 * @param documentId - Document ID (to get criteria mapping)
 * @param parsedData - Output from parser: { sheetName: [{...}, {...}] }
 */
export const createMultipleSheetsData = async (
  documentId: string,
  parsedData: Record<string, any[]>,
  tx?: any,
  format?: LKPSFormat
) => {
  const client = tx || prisma;
  const criterias = await client.lKPSCriteria.findMany({
    where: { documentId },
  });

  const criteriaByCodes: Record<string, any> = {};
  criterias.forEach((c: any) => {
    criteriaByCodes[c.criteriaCode] = c;
  });

  const { getSheetConfig } = await import('@/config/lkps.config');
  const createdSheets: any[] = [];

  for (const [sheetName, sheetData] of Object.entries(parsedData)) {
    const sheetConfig = getSheetConfig(sheetName, format);
    if (!sheetConfig) {
      console.warn(`Sheet config not found for ${sheetName}`);
      continue;
    }

    const kriteria = criteriaByCodes[sheetConfig.criteriaCode];
    if (!kriteria) {
      if (sheetConfig.criteriaCode !== '0') {
        console.warn(`Criteria ${sheetConfig.criteriaCode} not found for sheet ${sheetName}`);
      }
      continue;
    }

    let cleanedData: any[] = sheetData.filter((row) => {
      if (!row) return false;

      const nonEmptyVals = Object.values(row).filter(v => v !== null && v !== undefined && String(v).trim() !== '');
      if (nonEmptyVals.length === 0) return false;
      
      // If a row only has 1 column filled, it's almost certainly a footer/legend, not a valid data row
      if (nonEmptyVals.length === 1 && sheetConfig.rowType === 'free') {
        return false;
      }

      const hasHeaderArtifacts = Object.values(row).some(val => {
        if (typeof val === 'string') {
          const text = val.toLowerCase().replace(/\s+/g, '');
          if (!text) return false;

          const isLegendPrefix = 
            text === 'jumlah' || text === 'total' || text === 'ratarata' || text === 'rata-rata' ||
            text === '(a)' || text === '(b)' || text === '(c)' || text === 'info' || text === 'no.' || text === 'no' ||
            text.startsWith('jp=') || text.startsWith('jb=') || text.startsWith('ni=') || text.startsWith('nw=') ||
            text.startsWith('nd=') || text.startsWith('nk=') || text.startsWith('na=') || text.startsWith('nb=') ||
            text.startsWith('nc=') || text.startsWith('keterangan') || text.startsWith('catatan') || text.startsWith('*') ||
            text.includes('khususuntuk') || text.includes('judulpenelitian') || text.includes('jumlahmahasiswa') ||
            text.includes('dalamsemester') || text.includes('≤ms≤') || text.includes('<ms≤') || text.includes('ms>');
            
          // If it matches a legend prefix AND the row has <= 3 non-empty columns, it's definitely a legend
          if (isLegendPrefix && nonEmptyVals.length <= 3) return true;
          
          // Absolute matches that are always skipped
          if (['jumlah', 'total', 'ratarata', 'rata-rata', 'no.', 'no'].includes(text)) return true;
        }
        return false;
      });
      if (hasHeaderArtifacts) return false;

      const noKey = Object.keys(row).find(key => key.toLowerCase() === 'no') || Object.keys(row)[0];
      if (noKey && row[noKey]) {
        const noVal = String(row[noKey]).trim().toUpperCase();
        if (/^(I{1,3}|IV|V|VI{0,3}|IX|X|[A-Z])$/.test(noVal)) {
          return false; 
        }
      }

      // Check for LKPS sub-header numbering row (e.g., 1, 2, 3, 4, 5...) or (1), (2), (3)...
      const vals = Object.values(row)
        .filter(v => v !== '' && v !== null && v !== undefined)
        .map(v => String(v).replace(/[()]/g, '').trim());
      if (vals.length >= 3 && vals[0] === '1' && vals[1] === '2' && vals[2] === '3') {
        return false;
      }

      return Object.values(row).some((val) => {
        if (val === null || val === undefined) return false;
        if (String(val).trim() === '') return false; 
        return true;
      });
    }).map((row) => {
      const sanitizedRow = { ...row };
      
      for (const colConfig of sheetConfig.columns) {
        const key = colConfig.key;
        let val = sanitizedRow[key];

        if (typeof val === 'object' && val !== null && !(val instanceof Date)) {
           if ('result' in val) {
             val = typeof val.result === 'object' && val.result?.error ? '' : val.result;
           } else if ('error' in val) {
             val = ''; 
           } else if ('hyperlink' in val && 'text' in val) {
             val = val.text;
           } else if ('richText' in val) {
             val = val.richText.map((rt: any) => rt.text).join('');
           } else {
             val = ''; 
           }
        }

        if (typeof val === 'string') {
          val = val.trim();
        }

        if ((colConfig.type === 'text' || colConfig.type === 'textarea') && typeof val === 'number') {
           val = String(val);
        }

        sanitizedRow[key] = val;
      }
      return sanitizedRow;
    });

    if (sheetConfig.rowType === 'fixed' && sheetConfig.fixedRows) {
      const requiredLength = sheetConfig.fixedRows.length;
      
      if (cleanedData.length > requiredLength) {
        cleanedData = cleanedData.slice(0, requiredLength);
      } else if (cleanedData.length < requiredLength) {
        const kekurangan = requiredLength - cleanedData.length;
        for (let i = 0; i < kekurangan; i++) {
          cleanedData.push({});
        }
      }
    }

    const created = await createLKPSSheetData(
      kriteria.id,
      sheetName,
      sheetConfig.sheetTitle,
      cleanedData,
      tx
    );
    createdSheets.push(created);
  }

  return createdSheets;
};

/**
 * Get LKPS Sheet Data
 */
export const getLKPSSheetData = async (
  criteriaId: string,
  sheetName: string
) => {
  return await prisma.lKPSSheetData.findUnique({
    where: {
      criteriaId_sheetName: {
        criteriaId,
        sheetName,
      },
    },
  });
};

/**
 * Update LKPS Sheet Data
 */
export const updateLKPSSheetData = async (
  criteriaId: string,
  sheetName: string,
  data: any[]
) => {
  await checkLKPSLock(criteriaId);

  const validation = validateSheetData(sheetName, data);
  if (!validation.valid) {
    throw new Error(`Validasi data sheet "${sheetName}" gagal:\n${validation.errors.join('\n')}`);
  }

  const result = await prisma.lKPSSheetData.update({
    where: {
      criteriaId_sheetName: {
        criteriaId,
        sheetName,
      },
    },
    data: { data },
  });

  const criteria = await prisma.lKPSCriteria.findUnique({ where: { id: criteriaId }, include: { document: true } });
  if (criteria?.document?.prodiId) {
    generateEarlyWarnings(criteria.document.prodiId).catch(err => console.error('Failed to trigger early warnings after sheet update:', err));
  }

  return result;
};

/**
 * Mark sheet as completed
 */
export const markSheetCompleted = async (
  criteriaId: string,
  sheetName: string
) => {
  await checkLKPSLock(criteriaId);

  const result = await prisma.lKPSSheetData.update({
    where: {
      criteriaId_sheetName: {
        criteriaId,
        sheetName,
      },
    },
    data: { isCompleted: true },
  });

  const criteria = await prisma.lKPSCriteria.findUnique({ where: { id: criteriaId }, include: { document: true } });
  if (criteria?.document?.prodiId) {
    generateEarlyWarnings(criteria.document.prodiId).catch(err => console.error('Failed to trigger early warnings after sheet complete:', err));
  }

  return result;
};

/**
 * Auto-save sheet data (lightweight, skip full validation)
 * Used for real-time auto-save without blocking UX
 */
export const autoSaveLKPSSheetData = async (
  criteriaId: string,
  sheetName: string,
  data: any[]
) => {
  await checkLKPSLock(criteriaId);

  if (!Array.isArray(data)) {
    throw new Error('Data harus berupa array');
  }

  return await prisma.lKPSSheetData.update({
    where: {
      criteriaId_sheetName: {
        criteriaId,
        sheetName,
      },
    },
    data: { data, updatedAt: new Date() },
  });
};

/**
 * Save document as draft
 */
export const saveLKPSDocumentAsDraft = async (documentId: string) => {
  return await prisma.documentLKPS.update({
    where: { id: documentId },
    data: {
      status: 'DRAFT',
      updatedAt: new Date(),
    },
  });
};

/**
 * Finalize document (Dari Halaman Form)
 * Menggunakan "One Final Rule" Transaction
 */
export const finalizeLKPSDocument = async (documentId: string, userId: string) => {
  return await prisma.$transaction(async (tx: any) => {
    const targetDoc = await tx.documentLKPS.findUnique({ where: { id: documentId } });
    if (!targetDoc) throw new Error('Dokumen LKPS tidak ditemukan');

    // 1. Kudeta dokumen FINAL lama menjadi DRAFT di periode yang sama
    await tx.documentLKPS.updateMany({
      where: { 
        prodiId: targetDoc.prodiId, 
        periode: targetDoc.periode, 
        status: 'FINAL', 
        id: { not: documentId } 
      },
      data: { status: 'DRAFT', lockedAt: null, lockedBy: null } as any
    });

    // 2. Jadikan dokumen ini FINAL
    const result = await tx.documentLKPS.update({
      where: { id: documentId },
      data: {
        status: 'FINAL',
        lockedAt: new Date(),
        lockedBy: userId,
        updatedAt: new Date(),
      } as any,
    });

    generateEarlyWarnings(targetDoc.prodiId).catch(err => console.error('Failed to trigger early warnings after LKPS finalize:', err));
    return result;
  });
};

export const toggleLKPSStatus = async (id: string, targetStatus: DocumentStatus, userId: string) => {
  return await prisma.$transaction(async (tx: any) => {
    const targetDoc = await tx.documentLKPS.findUnique({ where: { id } });
    if (!targetDoc) throw new Error('Dokumen LKPS tidak ditemukan');

    let result;
    if (targetStatus === DocumentStatus.FINAL) {
      await tx.documentLKPS.updateMany({
        where: { 
          prodiId: targetDoc.prodiId, 
          periode: targetDoc.periode, 
          status: DocumentStatus.FINAL, 
          id: { not: id } 
        },
        data: { status: DocumentStatus.DRAFT, lockedAt: null, lockedBy: null } as any
      });
      result = await tx.documentLKPS.update({
        where: { id },
        data: { status: DocumentStatus.FINAL, lockedAt: new Date(), lockedBy: userId } as any
      });
    } else {
      result = await tx.documentLKPS.update({
        where: { id },
        data: { status: DocumentStatus.DRAFT, lockedAt: null, lockedBy: null } as any
      });
    }

    generateEarlyWarnings(targetDoc.prodiId).catch(err => console.error('Failed to trigger early warnings after LKPS status toggle:', err));
    return result;
  });
};
export const importLKPS = async (
  prodiId: string,
  parsedData: Record<string, any[]>,
  name: string,
  filePath: string,
  originalFilename: string,
  periode: string,
  format?: LKPSFormat
) => {
  return await prisma.$transaction(async (tx: any) => {
    // 1. Create Document
    const document = await createLKPSDocument(
      prodiId,
      parsedData,
      name,
      filePath,
      originalFilename,
      periode,
      tx
    );

    // 2. Create Criterias
    await createAllLKPSCriteria(document.id, tx);

    // 3. Create Sheet Data (format-aware)
    await createMultipleSheetsData(document.id, parsedData, tx, format);

    // 4. Auto-sync institusi data to newly created document
    await syncAllInstitusiToDocument(document.id, tx);

    generateEarlyWarnings(prodiId).catch(err => console.error('Failed to trigger early warnings after LKPS import:', err));
    return document;
  }, {
    timeout: 30000 // 30 seconds for large imports
  });
};

export const deleteLKPSDocument = async (documentId: string) => {
  const doc = await prisma.documentLKPS.findUnique({
    where: { id: documentId }
  });

  if (!doc) {
    throw new Error('Dokumen tidak ditemukan');
  }

  if (doc.status === 'FINAL') {
    throw new Error('Dokumen dengan status FINAL tidak dapat dihapus');
  }

  return await prisma.documentLKPS.delete({
    where: { id: documentId }
  });
};