const ExcelJS = require('exceljs');
import { Buffer } from 'buffer';
import { getSheetConfig, getSheetNamesByFormat, LKPSFormat } from '../config/lkps.config';

export interface LKPSParsedData {
  [sheetName: string]: any[];
}

/**
 * Helper: Extract cell value handling formulas, errors, hyperlinks, rich text, dates
 */
const extractCellValue = (cell: any): any => {
  let value = cell?.value;
  
  if (value === null || value === undefined) return '';
  
  if (value instanceof Date) {
    return value;
  }
  
  if (typeof value === 'object') {
    // Handle formula results
    if ('result' in value) {
      value = value.result;
      
      if (typeof value === 'object' && value !== null && 'error' in value) {
        return '';
      }
    }
    // Handle Excel Errors (contoh: #DIV/0!, #N/A, #VALUE!)
    else if ('error' in value) {
      return '';
    }
    // Handle Hyperlink
    else if ('hyperlink' in value && 'text' in value) {
      value = value.text; // Ambil teks penampilnya saja
    }
    // Handle Rich Text
    else if ('richText' in value) {
      value = value.richText.map((rt: any) => rt.text).join('');
    }
    // Fallback
    else {
      return ''; 
    }
  }
  
  return value !== undefined && value !== null ? value : '';
};

/**
 * Helper: Find data start row (first row with value "1" in column A or B)
 */
const findDataStartRow = (worksheet: any, maxRows = 30): number => {
  for (let r = 1; r <= maxRows; r++) {
    const row = worksheet.getRow(r);
    const valA = String(extractCellValue(row.getCell(1))).trim();
    const valB = String(extractCellValue(row.getCell(2))).trim();
    
    if (valA === '1' || valB === '1') {
      return r - 1; // Return the row BEFORE the first data row (acting as header row)
    }
  }
  return 10; // Default fallback
};

/**
 * Helper: Find start column (A=1 or B=2 where first row data starts)
 */
const findDataStartCol = (worksheet: any, headerRow: number): number => {
  const dataRow = headerRow + 1;
  const row = worksheet.getRow(dataRow);
  const valA = String(extractCellValue(row.getCell(1))).trim();
  const valB = String(extractCellValue(row.getCell(2))).trim();
  
  return (valA === '1') ? 1 : (valB === '1') ? 2 : 1;
};

/**
 * Main parser: Convert Excel array data to array of objects
 * @param buffer - Excel file buffer
 * @param format - 'INFOKOM' | 'TEKNIK' (defaults to INFOKOM)
 */
export const parseLKPSExcel = async (buffer: Buffer, format: LKPSFormat = 'INFOKOM'): Promise<LKPSParsedData> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as any);
  
  const result: LKPSParsedData = {};
  
  // Use format-specific sheet list
  const SHEETS = getSheetNamesByFormat(format);

  for (const sheetName of SHEETS) {
    const worksheet = workbook.getWorksheet(sheetName);
    if (!worksheet) {
      result[sheetName] = [];
      continue;
    }

    // Get sheet config to know column structure
    const sheetConfig = getSheetConfig(sheetName, format);
    if (!sheetConfig) {
      result[sheetName] = [];
      continue;
    }

    // Find where data starts
    const headerRow = findDataStartRow(worksheet);
    const startCol = findDataStartCol(worksheet, headerRow);
    const numCols = sheetConfig.columns.length;
    
    // Parse data rows (starting after header)
    const sheetData: any[] = [];
    let rowNum = headerRow + 1;
    let consecutiveEmptyRows = 0;
    
    while (true) {
      const row = worksheet.getRow(rowNum);
      const rowObj: any = {};
      let hasData = false;
      
      // Map each column to its key from config
      for (let colIdx = 0; colIdx < numCols; colIdx++) {
        const columnConfig = sheetConfig.columns[colIdx];
        const cell = row.getCell(startCol + colIdx);
        const value = extractCellValue(cell);
        
        if (value !== '' && value !== null && value !== undefined) {
          hasData = true;
        }
        
        // Type conversion based on column type
        let typedValue = value;
        if (columnConfig.type === 'number' && value !== '' && !isNaN(Number(value))) {
          typedValue = Number(value);
        } else if (columnConfig.type === 'boolean') {
          typedValue = value === true || value === 'true' || value === 1 || value === '1';
        }
        
        rowObj[columnConfig.key] = typedValue || '';
      }
      
      if (hasData) {
        sheetData.push(rowObj);
        consecutiveEmptyRows = 0;
      } else {
        consecutiveEmptyRows++;
      }
      
      // Stop if 10 consecutive empty rows or reached max
      if (consecutiveEmptyRows >= 10 || rowNum > 1000) break;
      rowNum++;
    }
    
    result[sheetName] = sheetData;
  }

  return result;
};
