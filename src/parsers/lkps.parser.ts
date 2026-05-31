const ExcelJS = require('exceljs');
import { Buffer } from 'buffer';
import { getSheetConfig } from '../config/lkps.config';

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
    const valA = extractCellValue(row.getCell(1));
    const valB = extractCellValue(row.getCell(2));
    
    if (valA === 1 || valB === 1) {
      return r;
    }
  }
  return 10; // Default fallback
};

/**
 * Helper: Find start column (A=1 or B=2 where first row data starts)
 */
const findDataStartCol = (worksheet: any, headerRow: number): number => {
  const row = worksheet.getRow(headerRow);
  const valA = extractCellValue(row.getCell(1));
  const valB = extractCellValue(row.getCell(2));
  
  return (valA === 1) ? 1 : 2;
};

/**
 * Main parser: Convert Excel array data to array of objects
 */
export const parseLKPSExcel = async (buffer: Buffer): Promise<LKPSParsedData> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as any);
  
  const result: LKPSParsedData = {};
  
  const SHEETS = [
    'PS', 'PSPPI', '1', '2a1', '2a2', '2a3', '2b', '3a1', '3a2', '3a3', '3a4', '3a5', '3b', '3c', 
    '4a', '4b', '4c', '4d', '4e', '4f-1', '4f-2', '4f-3', '4f-4', '4g', '4h', '4i', '4j', '4k', 
    '5a', '5b', '5c', '6a', '6b', '6c1', '6c2', '6d', '6e1', '6e2', '6e3-1', '6e3-2', '6e3-3', 
    '6e3-4', '6e4', '6f1', '6f2', '6g1', '6g2', '6h1', '6h2', '6i', '7a', '7b'
  ];

  for (const sheetName of SHEETS) {
    const worksheet = workbook.getWorksheet(sheetName);
    if (!worksheet) {
      result[sheetName] = [];
      continue;
    }

    // Get sheet config to know column structure
    const sheetConfig = getSheetConfig(sheetName);
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
