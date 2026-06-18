import prisma from '../config/database.config';
import { generateEarlyWarnings } from './notification.service';

export const upsertAndSyncInstitusi = async (
  periode: string,
  sheetName: string,
  prodiId: string | null,
  uppsDataPayload: any[],
  userId: string
) => {
  const existingInstitusi = await prisma.dataInstitusi.findFirst({
    where: {
      periode,
      sheetName,
      prodiId,
    },
  });

  const dataInstitusi = existingInstitusi
    ? await prisma.dataInstitusi.update({
        where: { id: existingInstitusi.id },
        data: { data: uppsDataPayload, createdById: userId },
      })
    : await prisma.dataInstitusi.create({
        data: {
          periode,
          sheetName,
          prodiId,
          data: uppsDataPayload,
          createdById: userId,
        },
      });

  const SHEET_MAP: Record<string, Record<string, string | null>> = {
    '2b': { INFOKOM: '2b', TEKNIK: '4a' },
    '4b': { INFOKOM: '4b', TEKNIK: null }, 
    '6a': { INFOKOM: '6a', TEKNIK: '2b' }
  };

  const documents = await prisma.documentLKPS.findMany({
    where: {
      periode,
      ...(prodiId ? { prodiId } : {}),
    },
    include: {
      prodi: true,
      criterias: {
        include: {
          sheets: true
        }
      }
    }
  });

  for (const doc of documents) {
    const category = doc.prodi.category || 'TEKNIK';
    const mapping = SHEET_MAP[sheetName];
    const targetSheetName = mapping ? mapping[category] : sheetName;

    if (!targetSheetName) continue; 

    for (const criteria of doc.criterias) {
      const sheet = criteria.sheets.find(s => s.sheetName === targetSheetName);
      if (sheet) {
        let currentData: any[] = (sheet.data as any[]) || [];

        const mergedData = currentData.map((row) => {
          const uppsRow = uppsDataPayload.find((u) => u.no === row.no);
          if (uppsRow) {
            return { ...row, ...uppsRow };
          }
          return row;
        });

        // Temukan baris baru dari UPPS yang belum ada di LKPS
        const newRows = uppsDataPayload.filter(
          (u) => !currentData.some((row) => row.no === u.no)
        );

        const finalDataToSave = currentData.length > 0 ? [...mergedData, ...newRows] : uppsDataPayload;

        await prisma.lKPSSheetData.update({
          where: { id: sheet.id },
          data: { data: finalDataToSave },
        });
      }
    }
  }

  generateEarlyWarnings(prodiId || undefined).catch(err => console.error('Failed to trigger early warnings after institusi sync:', err));

  return dataInstitusi;
};

export const getDataInstitusi = async (periode: string, sheetName?: string, prodiId?: string) => {
  const whereClause: any = { periode };
  if (sheetName) whereClause.sheetName = sheetName;
  if (prodiId) whereClause.prodiId = prodiId;
  
  return await prisma.dataInstitusi.findMany({
    where: whereClause,
  });
};