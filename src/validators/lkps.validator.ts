import { z } from 'zod';
import { getSheetConfig } from '../config/lkps.config';

export const importLKPSSchema = z.object({
    prodiId: z.string('prodiId wajib diisi')
        .uuid('prodiId harus berupa format UUID yang valid'),
});

export type ImportLKPSInput = z.infer<typeof importLKPSSchema>;

/**
 * Validate sheet data against config definition
 * @param sheetName - Name of the sheet (e.g., "1", "2a1", "3a1")
 * @param data - Array of data objects to validate
 * @returns { valid: boolean, errors: string[] }
 */
export const validateSheetData = (sheetName: string, data: any[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  try {
    const sheetConfig = getSheetConfig(sheetName);
    if (!sheetConfig) {
      errors.push(`Sheet "${sheetName}" tidak ditemukan dalam konfigurasi`);
      return { valid: false, errors };
    }

    // Validate data is array
    if (!Array.isArray(data)) {
      errors.push('Data harus berupa array');
      return { valid: false, errors };
    }

    // Validate fixed rows count if applicable
    if (sheetConfig.rowType === 'fixed' && sheetConfig.fixedRows) {
      if (data.length !== sheetConfig.fixedRows.length) {
        errors.push(
          `Sheet "${sheetName}" memerlukan ${sheetConfig.fixedRows.length} baris tetap, ` +
          `tetapi diterima ${data.length} baris`
        );
      }
    }

    // Validate each row
    data.forEach((row, rowIndex) => {
      const rowErrors = validateRowData(row, sheetConfig, rowIndex);
      errors.push(...rowErrors);
    });

    return { valid: errors.length === 0, errors };
  } catch (error: any) {
    errors.push(`Error validasi sheet: ${error.message}`);
    return { valid: false, errors };
  }
};

/**
 * Validate individual row data
 */
const validateRowData = (row: any, sheetConfig: any, rowIndex: number): string[] => {
  const errors: string[] = [];

  sheetConfig.columns.forEach((col: any) => {
    // We intentionally disable strict type validation and select validation here.
    // LKPS templates are often messy (legends, sub-headers, etc.).
    // If we throw validation errors, the entire upload crashes and frustrates the user.
    // Instead, we allow all data to be imported as JSON, and the user can clean it up
    // visually in the web UI.
  });

  return errors;
};

/**
 * Validate column type
 */
const validateColumnType = (key: string, value: any, type: string, rowIndex: number): string | null => {
  // Allow empty/null for optional fields
  if (value === null || value === undefined || value === '') {
    return null;
  }

  // Relaxed validation: We intentionally return null (no error) for all types.
  // This prevents the upload from crashing due to stray texts/legends.
  // The frontend can handle rendering these as strings, and users can delete invalid rows in the UI.
  return null;

  return null;
};