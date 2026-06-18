-- DropIndex
DROP INDEX "DataInstitusi_periode_sheetName_prodiId_key";

-- DropIndex
DROP INDEX "DataInstitusi_prodiId_idx";

-- AlterTable
ALTER TABLE "Prodi" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'TEKNIK';
