import { Prisma } from '@prisma/client';
import prisma from '../config/database.config';
import { LKPS_KRITERIA } from '../config/lkps.config';
import { generateEarlyWarnings } from './notification.service';

export interface SimulationIndicator {
  code: string;
  name: string;
  quantitativeScore: number;
  qualitativeScore: number | null;
  qualitativeNote?: string | null;
  totalScore: number;
  evidenceCount: number;
  sheetCompletion: number;
}

const normalizeIndicatorText = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return value.toLowerCase().trim();
};

const buildIndicatorTemplate = () =>
  Object.entries(LKPS_KRITERIA).map(([criteriaCode, criteriaInfo]) => ({
    code: `C.${criteriaCode}`,
    name: criteriaInfo.name,
  }));

const parseSavedIndicators = (value: unknown): Array<Partial<SimulationIndicator>> => {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is Partial<SimulationIndicator> =>
      item !== null && typeof item === 'object' && 'code' in item && typeof (item as any).code === 'string'
    )
    .map((item) => ({
      code: typeof item.code === 'string' ? item.code : '',
      name: typeof item.name === 'string' ? item.name : '',
      quantitativeScore: typeof item.quantitativeScore === 'number' ? item.quantitativeScore : 0,
      qualitativeScore:
        item.qualitativeScore === null || typeof item.qualitativeScore === 'number'
          ? item.qualitativeScore
          : null,
      qualitativeNote:
        item.qualitativeNote === undefined || item.qualitativeNote === null
          ? null
          : typeof item.qualitativeNote === 'string'
            ? item.qualitativeNote
            : null,
      totalScore: typeof item.totalScore === 'number' ? item.totalScore : 0,
      evidenceCount: typeof item.evidenceCount === 'number' ? item.evidenceCount : 0,
      sheetCompletion: typeof item.sheetCompletion === 'number' ? item.sheetCompletion : 0,
    }));
};

const calculateIndicatorQuantitative = async (prodiId: string) => {
  const latestLKPS = await prisma.documentLKPS.findFirst({
    where: { prodiId },
    orderBy: { updatedAt: 'desc' },
    include: {
      criterias: {
        include: {
          sheets: true,
        },
      },
    },
  });

  const evidenDocs = await prisma.dokumenEviden.findMany({
    where: { prodiId, status: 'FINAL' }, // Only final evidence counts
    select: {
      indikator: true,
    },
  });

  const evidenceCountByCriteria = Object.keys(LKPS_KRITERIA).reduce<Record<string, number>>((acc, code) => {
    acc[code] = 0;
    return acc;
  }, {});

  evidenDocs.forEach((doc:{ indikator: unknown }) => {
    const indicators = Array.isArray(doc.indikator) ? doc.indikator : [];
    const processedInThisDoc = new Set<string>();

    indicators.forEach((indicator) => {
      const normalized = normalizeIndicatorText(indicator);
      
      Object.entries(LKPS_KRITERIA).forEach(([criteriaCode, criteriaInfo]) => {
        if (processedInThisDoc.has(criteriaCode)) return;

        const codeMatch = normalized === criteriaCode || normalized === `c${criteriaCode}` || normalized === `kriteria ${criteriaCode}`;
        const nameMatch = normalized === criteriaInfo.name.toLowerCase();
        
        if (codeMatch || nameMatch) {
          evidenceCountByCriteria[criteriaCode] = Math.min(evidenceCountByCriteria[criteriaCode] + 1, 10);
          processedInThisDoc.add(criteriaCode);
        }
      });
    });
  });

  const criteriaCompletion: Record<string, number> = {};
  if (latestLKPS) {
    latestLKPS.criterias.forEach((criteria) => {
      const totalSheets = criteria.sheets.length;
      if (totalSheets === 0) {
        criteriaCompletion[criteria.criteriaCode] = 0;
        return;
      }
      const completedSheets = criteria.sheets.filter((sheet) => sheet.isCompleted).length;
      criteriaCompletion[criteria.criteriaCode] = completedSheets / totalSheets;
    });
  }

  const indicatorTemplates = buildIndicatorTemplate();

  const indicators: SimulationIndicator[] = indicatorTemplates.map((indicator) => {
    const criteriaCode = indicator.code.replace('C.', '');
    const sheetCompletion = Math.round((criteriaCompletion[criteriaCode] ?? 0) * 100);
    const evidenceCount = evidenceCountByCriteria[criteriaCode] ?? 0;
    
    // Kuantitatif (LKPS): max 400
    const quantitativeScore = Math.round((sheetCompletion / 100) * 400);
    
    // Auto Kualitatif (LED + Eviden) fallback: max 400 based on evidence
    const evidenceRatio = Math.min(evidenceCount / 5, 1);
    const autoQualitativeScore = Math.round(evidenceRatio * 400);

    // Total default (70% kuantitatif + 30% kualitatif)
    const totalScore = Math.round(quantitativeScore * 0.7 + autoQualitativeScore * 0.3);

    return {
      ...indicator,
      quantitativeScore,
      qualitativeScore: null, // Still null to indicate it hasn't been manually assessed
      qualitativeNote: null,
      totalScore,
      evidenceCount,
      sheetCompletion,
    };
  });

  const totalQuantitativeScore = indicators.length
    ? Math.round(indicators.reduce((sum, indicator) => sum + indicator.quantitativeScore, 0) / indicators.length)
    : 0;

  return {
    indicators,
    quantitativeScore: totalQuantitativeScore,
  };
};

const mergeManualQualitative = (
  autoIndicators: SimulationIndicator[],
  savedIndicators: Array<Partial<SimulationIndicator>> = []
): SimulationIndicator[] => {
  const manualMap = new Map<string, Partial<SimulationIndicator>>();
  savedIndicators.forEach((item) => {
    if (item.code) {
      manualMap.set(item.code, item);
    }
  });

  return autoIndicators.map((item) => {
    const manual = manualMap.get(item.code);
    const qualitativeScore = manual?.qualitativeScore ?? null;
    const qualitativeNote = manual?.qualitativeNote ?? null;
    
    // Use manual qualitative score if exists, else use the auto-calculated one (which is embedded in the initial totalScore logic or we can recalculate it here)
    const autoQualitativeScore = Math.round(Math.min(item.evidenceCount / 5, 1) * 400);
    const finalQualitativeScore = qualitativeScore !== null ? qualitativeScore : autoQualitativeScore;
    
    const totalScore = Math.round(item.quantitativeScore * 0.7 + finalQualitativeScore * 0.3);

    return {
      ...item,
      qualitativeScore,
      qualitativeNote,
      totalScore,
    };
  });
};

const buildSimulationSummary = (indicators: SimulationIndicator[]) => {
  const totalQuantitative = indicators.reduce((sum, item) => sum + item.quantitativeScore, 0);
  const totalQualitative = indicators.reduce((sum, item) => sum + (item.qualitativeScore ?? 0), 0);
  const countWithQualitative = indicators.filter((item) => item.qualitativeScore !== null).length;
  const totalFinal = indicators.reduce((sum, item) => sum + item.totalScore, 0);

  return {
    quantitativeScore: indicators.length ? Math.round(totalQuantitative / indicators.length) : 0,
    qualitativeScore: countWithQualitative ? Math.round(totalQualitative / countWithQualitative) : 0,
    totalScore: indicators.length ? Math.round(totalFinal / indicators.length) : 0,
  };
};

export const getSimulationByProdi = async (prodiId: string) => {
  const prodi = await prisma.prodi.findUnique({ where: { id: prodiId } });
  if (!prodi) throw new Error('Program studi tidak ditemukan');

  const autoSimulation = await calculateIndicatorQuantitative(prodiId);
  const existing = await prisma.accreditationSimulation.findUnique({ where: { prodiId } });
  const savedIndicators = parseSavedIndicators(existing?.indicators);

  const indicators = mergeManualQualitative(autoSimulation.indicators, savedIndicators);
  const summary = buildSimulationSummary(indicators);

  const result = await prisma.accreditationSimulation.upsert({
    where: { prodiId },
    update: {
      indicators: indicators as unknown as any,
      quantitativeScore: summary.quantitativeScore,
      qualitativeScore: summary.qualitativeScore,
      totalScore: summary.totalScore,
    },
    create: {
      prodiId,
      indicators: indicators as unknown as any,
      quantitativeScore: summary.quantitativeScore,
      qualitativeScore: summary.qualitativeScore,
      totalScore: summary.totalScore,
    },
  });

  return {
    prodiId,
    indicators,
    quantitativeScore: summary.quantitativeScore,
    qualitativeScore: summary.qualitativeScore,
    totalScore: summary.totalScore,
    updatedAt: result.updatedAt.toISOString(),
  };
};

export const updateSimulationQualitative = async (
  prodiId: string,
  qualitativeScores: Array<{ code: string; qualitativeScore?: number | null; qualitativeNote?: string | null }>
) => {
  const prodi = await prisma.prodi.findUnique({ where: { id: prodiId } });
  if (!prodi) throw new Error('Program studi tidak ditemukan');

  const existing = await prisma.accreditationSimulation.findUnique({ where: { prodiId } });
  const savedIndicators = parseSavedIndicators(existing?.indicators);
  
  const autoSimulation = await calculateIndicatorQuantitative(prodiId);
  const mergedIndicators = autoSimulation.indicators.map((indicator) => {
    // Find update for this indicator
    const update = qualitativeScores.find((item) => item.code === indicator.code);
    // Find existing qualitative data
    const existingData = savedIndicators.find((item) => item.code === indicator.code);
    
    // Use update value if provided, otherwise keep existing, otherwise null
    const qualitativeScore = update?.qualitativeScore !== undefined 
      ? update.qualitativeScore
      : existingData?.qualitativeScore ?? null;
    const qualitativeNote = update?.qualitativeNote !== undefined
      ? update.qualitativeNote
      : existingData?.qualitativeNote ?? null;
    
    const autoQualitativeScore = Math.round(Math.min(indicator.evidenceCount / 5, 1) * 400);
    const finalQualitativeScore = qualitativeScore !== null ? qualitativeScore : autoQualitativeScore;
    
    const totalScore = Math.round(indicator.quantitativeScore * 0.7 + finalQualitativeScore * 0.3);

    return {
      ...indicator,
      qualitativeScore,
      qualitativeNote,
      totalScore,
    };
  });

  const summary = buildSimulationSummary(mergedIndicators);

  const result = await prisma.accreditationSimulation.upsert({
    where: { prodiId },
    update: {
      indicators: mergedIndicators as unknown as any,
      quantitativeScore: summary.quantitativeScore,
      qualitativeScore: summary.qualitativeScore,
      totalScore: summary.totalScore,
    },
    create: {
      prodiId,
      indicators: mergedIndicators as unknown as any,
      quantitativeScore: summary.quantitativeScore,
      qualitativeScore: summary.qualitativeScore,
      totalScore: summary.totalScore,
    },
  });

  await generateEarlyWarnings(prodiId).catch(err => console.error('Failed to trigger early warnings after simulation update:', err));

  return {
    prodiId,
    indicators: mergedIndicators,
    quantitativeScore: summary.quantitativeScore,
    qualitativeScore: summary.qualitativeScore,
    totalScore: summary.totalScore,
    updatedAt: result.updatedAt.toISOString(),
  };
};
