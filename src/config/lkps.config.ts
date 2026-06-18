export interface LKPSSheetColumn {
  key: string;
  label: string;
  type: 'number' | 'text' | 'textarea' | 'date' | 'url' | 'boolean' | 'select';
  options?: string[];
  autoCalculated?: boolean;
  notes?: string;
}

export interface LKPSSheetConfig {
  sheetName: string;
  sheetTitle: string;
  criteriaCode: string;
  subCriteriaCode?: string | null;
  headerRows: number;
  rowType: 'free' | 'fixed' | 'form';
  fixedRows?: string[];
  columns: LKPSSheetColumn[];
  applicableTo: string[];
}

export type LKPSFormat = 'INFOKOM' | 'TEKNIK';

// ============================================================
// SHARED COLUMN DEFINITIONS
// ============================================================
const COLLABORATION_COLUMNS: LKPSSheetColumn[] = [
  { key: 'no', label: 'No.', type: 'number' },
  { key: 'lembaga_mitra', label: 'Lembaga Mitra', type: 'text' },
  { key: 'tingkat_internasional', label: 'Tingkat: Internasional', type: 'boolean' },
  { key: 'tingkat_nasional', label: 'Tingkat: Nasional', type: 'boolean' },
  { key: 'tingkat_lokal', label: 'Tingkat: Lokal/Wilayah', type: 'boolean' },
  { key: 'judul_kerjasama', label: 'Judul Kegiatan Kerjasama', type: 'text' },
  { key: 'manfaat', label: 'Manfaat bagi PS yang Diakreditasi', type: 'textarea' },
  { key: 'tgl_awal', label: 'Tanggal Awal Kerjasama (HH/BB/TTTT)', type: 'date' },
  { key: 'tgl_akhir', label: 'Tanggal Akhir Kerjasama (HH/BB/TTTT)', type: 'date' },
  { key: 'durasi', label: 'Durasi (dalam tahun)', type: 'number' },
  { key: 'status_kerjasama', label: 'Status Kerjasama', type: 'text' },
  { key: 'bukti_kerjasama', label: 'Bukti Kerjasama', type: 'url' },
];

const HKIPATEN_COLUMNS: LKPSSheetColumn[] = [
  { key: 'no', label: 'No', type: 'number' },
  { key: 'judul_luaran', label: 'Judul Luaran Penelitian dan PkM', type: 'text' },
  { key: 'tanggal', label: 'Tanggal (HH/BB/TTTT)', type: 'date' },
  { key: 'nomor_paten', label: 'Nomor Paten (Granted)', type: 'text' },
];

const HKIHAKCIP_COLUMNS: LKPSSheetColumn[] = [
  { key: 'no', label: 'No', type: 'number' },
  { key: 'judul_luaran', label: 'Judul Luaran Penelitian dan PkM', type: 'text' },
  { key: 'tanggal', label: 'Tanggal (HH/BB/TTTT)', type: 'date' },
  { key: 'keterangan', label: 'Keterangan (Nomor Sertifikat)', type: 'text' },
];

const HKITKT_COLUMNS: LKPSSheetColumn[] = [
  { key: 'no', label: 'No', type: 'number' },
  { key: 'judul_luaran', label: 'Luaran Penelitian dan PkM', type: 'text' },
  { key: 'tanggal', label: 'Tanggal (HH/BB/TTTT)', type: 'date' },
  { key: 'status_tkt', label: 'Status (Tingkat Kesiapan Teknologi)', type: 'text' },
  { key: 'nomor_sertifikat_tkt', label: 'Nomor Sertifikat TKT', type: 'text' },
];

const HKIBUKU_COLUMNS: LKPSSheetColumn[] = [
  { key: 'no', label: 'No', type: 'number' },
  { key: 'judul_luaran', label: 'Luaran Penelitian dan PkM', type: 'text' },
  { key: 'tanggal', label: 'Tanggal (HH/BB/TTTT)', type: 'date' },
  { key: 'nomor_isbn', label: 'Keterangan (Nomor ISBN)', type: 'text' },
];

const PRESTASI_COLUMNS: LKPSSheetColumn[] = [
  { key: 'no', label: 'No.', type: 'number' },
  { key: 'nama_kegiatan', label: 'Nama Kegiatan', type: 'text' },
  { key: 'waktu_perolehan', label: 'Waktu Perolehan (HH/BB/TTTT)', type: 'date' },
  { key: 'tingkat_lokal', label: 'Tingkat: Lokal/Wilayah', type: 'boolean' },
  { key: 'tingkat_nasional', label: 'Tingkat: Nasional', type: 'boolean' },
  { key: 'tingkat_internasional', label: 'Tingkat: Internasional', type: 'boolean' },
  { key: 'prestasi', label: 'Prestasi yang Dicapai', type: 'text' },
];

const PUBLIKASI_COLUMNS: LKPSSheetColumn[] = [
  { key: 'no', label: 'No.', type: 'number' },
  { key: 'jenis_publikasi', label: 'Jenis Publikasi', type: 'text' },
  { key: 'jumlah_ts_minus2', label: 'Jumlah Judul - TS-2', type: 'number' },
  { key: 'jumlah_ts_minus1', label: 'Jumlah Judul - TS-1', type: 'number' },
  { key: 'jumlah_ts', label: 'Jumlah Judul - TS', type: 'number' },
  { key: 'jumlah_total', label: 'Jumlah', type: 'number', autoCalculated: true },
];

const PS_COLUMNS: LKPSSheetColumn[] = [
  { key: 'no', label: 'No', type: 'number' },
  { key: 'jenis_program', label: 'Jenis Program', type: 'text' },
  { key: 'nama_prodi', label: 'Nama Program Studi', type: 'text' },
  { key: 'status_akreditasi', label: 'Akreditasi - Status/Peringkat', type: 'select', options: ['Terakreditasi Unggul', 'Terakreditasi A', 'Terakreditasi Baik Sekali', 'Terakreditasi B', 'Terakreditasi Baik', 'Terakreditasi C', 'Terakreditasi Minimum', 'Tidak Terakreditasi'] },
  { key: 'no_sk', label: 'Akreditasi - No. dan Tgl. SK', type: 'text' },
  { key: 'tgl_kedaluwarsa', label: 'Akreditasi - Tgl. Kadaluarsa', type: 'date' },
  { key: 'jumlah_mahasiswa', label: 'Jumlah Mahasiswa saat TS', type: 'number' },
];

// ============================================================
// FORMAT INFOKOM
// (S1 Informatika & S1 Sistem Teknologi Informasi)
// ============================================================
export const LKPS_SHEETS_INFOKOM: Record<string, LKPSSheetConfig> = {
  PS: {
    sheetName: 'PS', sheetTitle: 'Daftar Program Studi di UPPS', criteriaCode: '0',
    headerRows: 10, rowType: 'free', columns: PS_COLUMNS, applicableTo: ['S'],
  },
  PSPPI: {
    sheetName: 'PSPPI', sheetTitle: 'Disiplin Teknik Keinsinyuran (PSPPI)', criteriaCode: '0',
    headerRows: 5, rowType: 'fixed',
    fixedRows: ['Kebumian dan Energi', 'Rekayasa Sipil', 'Industri', 'Konservasi', 'Pertanian', 'Kelautan', 'Aeronotika'],
    columns: [
      { key: 'no', label: 'No', type: 'number' },
      { key: 'disiplin', label: 'Disiplin Teknik Keinsinyuran', type: 'text' },
      { key: 'penyelenggaraan_ya', label: 'Penyelenggaraan - Ya', type: 'boolean' },
      { key: 'penyelenggaraan_tidak', label: 'Penyelenggaraan - Tidak', type: 'boolean' },
    ],
    applicableTo: ['S'],
  },
  '1': {
    sheetName: '1', sheetTitle: 'Tabel 1: Visi Misi Tujuan Strategi (VMTS)', criteriaCode: '1',
    headerRows: 4, rowType: 'free',
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'jenis_vmts', label: 'Jenis VMTS', type: 'text' },
      { key: 'pernyataan', label: 'Pernyataan', type: 'textarea' },
      { key: 'no_sk', label: 'No. Surat Keputusan (SK)', type: 'text' },
      { key: 'link_dokumen', label: 'Link Dokumen', type: 'url' },
    ],
    applicableTo: ['S'],
  },
  '2a1': { sheetName: '2a1', sheetTitle: 'Tabel 2 Bagian 1: Kerjasama Pendidikan', criteriaCode: '2', subCriteriaCode: '2a', headerRows: 11, rowType: 'free', columns: COLLABORATION_COLUMNS, applicableTo: ['S'] },
  '2a2': { sheetName: '2a2', sheetTitle: 'Tabel 2 Bagian 2: Kerjasama Penelitian', criteriaCode: '2', subCriteriaCode: '2a', headerRows: 11, rowType: 'free', columns: COLLABORATION_COLUMNS, applicableTo: ['S'] },
  '2a3': { sheetName: '2a3', sheetTitle: 'Tabel 2 Bagian 3: Kerjasama PkM', criteriaCode: '2', subCriteriaCode: '2a', headerRows: 11, rowType: 'free', columns: COLLABORATION_COLUMNS, applicableTo: ['S'] },
  '2b': {
    sheetName: '2b', sheetTitle: 'Tabel 2b: Keuangan', criteriaCode: '2', subCriteriaCode: '2b',
    headerRows: 5, rowType: 'fixed',
    fixedRows: ['Biaya Operasional > a. Biaya Dosen', 'b. Tenaga Kependidikan', 'c. Operasional Pembelajaran', 'd. Operasional Tidak Langsung', 'e. Investasi', 'Penelitian', 'PkM', 'Lainnya'],
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'jenis_penggunaan', label: 'Jenis Penggunaan', type: 'text' },
      { key: 'upps_ts_minus2', label: 'UPPS - TS-2', type: 'number' },
      { key: 'upps_ts_minus1', label: 'UPPS - TS-1', type: 'number' },
      { key: 'upps_ts', label: 'UPPS - TS', type: 'number' },
      { key: 'upps_rata', label: 'UPPS - Rata-rata', type: 'number', autoCalculated: true },
      { key: 'ps_ts_minus2', label: 'PS - TS-2', type: 'number' },
      { key: 'ps_ts_minus1', label: 'PS - TS-1', type: 'number' },
      { key: 'ps_ts', label: 'PS - TS', type: 'number' },
      { key: 'ps_rata', label: 'PS - Rata-rata', type: 'number', autoCalculated: true },
    ],
    applicableTo: ['S'],
  },
  '3a1': {
    sheetName: '3a1', sheetTitle: 'Tabel 3.a.1: Kurikulum dan Rencana Pembelajaran', criteriaCode: '3', subCriteriaCode: '3a',
    headerRows: 8, rowType: 'free',
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'semester', label: 'Semester', type: 'number' },
      { key: 'kode_mk', label: 'Kode Mata Kuliah', type: 'text' },
      { key: 'nama_mk', label: 'Nama Mata Kuliah', type: 'text' },
      { key: 'mk_kompetensi', label: 'Mata Kuliah Kompetensi', type: 'text' },
      { key: 'sks_kuliah', label: 'Bobot Kredit - Kuliah/Responsi/Tutorial', type: 'number' },
      { key: 'sks_seminar', label: 'Bobot Kredit - Seminar', type: 'number' },
      { key: 'sks_praktikum', label: 'Bobot Kredit - Praktikum/Praktik', type: 'number' },
      { key: 'konversi_kredit', label: 'Konversi Kredit ke Jam (Vokasi)', type: 'number' },
      { key: 'dok_rps', label: 'Dokumen Rencana Pembelajaran', type: 'url' },
      { key: 'unit_penyelenggara', label: 'Unit Penyelenggara', type: 'select', options: ['Universitas', 'Fakultas', 'Prodi'] },
    ],
    applicableTo: ['S'],
  },
  '3a2': {
    sheetName: '3a2', sheetTitle: 'Tabel 3.a.2: Kelengkapan RPS', criteriaCode: '3', subCriteriaCode: '3a',
    headerRows: 8, rowType: 'free',
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'mata_kuliah', label: 'Mata Kuliah', type: 'text' },
      { key: 'bobot_sks', label: 'Bobot (sks)', type: 'number' },
      { key: 'konversi_teori', label: 'Konversi Kredit ke Jam - Teori', type: 'number' },
      { key: 'konversi_praktik', label: 'Konversi Kredit ke Jam - Praktik', type: 'number' },
      { key: 'kelengkapan_rps', label: 'Kelengkapan Dokumen RPS', type: 'select', options: ['Ada', 'Tidak Ada'] },
    ],
    applicableTo: ['S'],
  },
  '3a3': {
    sheetName: '3a3', sheetTitle: 'Tabel 3.a.3: Integrasi Penelitian/PkM ke Pembelajaran', criteriaCode: '3', subCriteriaCode: '3a',
    headerRows: 11, rowType: 'free',
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'nama_dosen', label: 'Nama Dosen', type: 'text' },
      { key: 'judul_penelitian_pkm', label: 'Judul Penelitian/PkM', type: 'text' },
      { key: 'mata_kuliah', label: 'Mata Kuliah', type: 'text' },
      { key: 'bentuk_integrasi', label: 'Bentuk Integrasi', type: 'text' },
      { key: 'tahun_ts_minus2', label: 'Tahun - TS-2', type: 'number' },
      { key: 'tahun_ts_minus1', label: 'Tahun - TS-1', type: 'number' },
      { key: 'tahun_ts', label: 'Tahun - TS', type: 'number' },
      { key: 'kesesuaian_roadmap', label: 'Kesesuaian dengan Peta Jalan', type: 'text' },
      { key: 'bukti_sahih', label: 'Bukti Sahih', type: 'text' },
      { key: 'kesesuaian_rps', label: 'Kesesuaian RPS', type: 'text' },
    ],
    applicableTo: ['S'],
  },
  '3a4': {
    sheetName: '3a4', sheetTitle: 'Tabel 3.a.4: Mata Kuliah Basic Science dan Matematika', criteriaCode: '3', subCriteriaCode: '3a',
    headerRows: 6, rowType: 'free',
    columns: [
      { key: 'no', label: 'No', type: 'number' },
      { key: 'nama_mk', label: 'Nama Mata Kuliah Basic Science dan Matematika', type: 'text' },
      { key: 'semester', label: 'Semester', type: 'number' },
      { key: 'jumlah_sks', label: 'Jumlah SKS', type: 'number' },
    ],
    applicableTo: ['S'],
  },
  '3a5': {
    sheetName: '3a5', sheetTitle: 'Tabel 3.a.5: Mata Kuliah Capstone Design', criteriaCode: '3', subCriteriaCode: '3a',
    headerRows: 6, rowType: 'free',
    columns: [
      { key: 'no', label: 'No', type: 'number' },
      { key: 'mk_pendukung', label: 'Nama Mata Kuliah Pendukung Capstone Design', type: 'text' },
      { key: 'sks_pendukung', label: 'Jumlah SKS Pendukung', type: 'number' },
      { key: 'mk_capstone', label: 'Nama Mata Kuliah Capstone Design', type: 'text' },
      { key: 'sks_capstone', label: 'Jumlah SKS Capstone Design', type: 'number' },
      { key: 'semester', label: 'Semester', type: 'number' },
      { key: 'cakupan_bahasan', label: 'Cakupan Bahasan', type: 'textarea' },
    ],
    applicableTo: ['S'],
  },
  '3b': {
    sheetName: '3b', sheetTitle: 'Tabel 3.b: Penelitian DTPS', criteriaCode: '3', subCriteriaCode: '3b',
    headerRows: 6, rowType: 'fixed', fixedRows: ['PT/Mandiri', 'Dalam Negeri', 'Luar Negeri'],
    columns: PUBLIKASI_COLUMNS,
    applicableTo: ['S'],
  },
  '3c': {
    sheetName: '3c', sheetTitle: 'Tabel 3.c: PkM DTPS', criteriaCode: '3', subCriteriaCode: '3c',
    headerRows: 6, rowType: 'fixed', fixedRows: ['PT/Mandiri', 'Dalam Negeri', 'Luar Negeri'],
    columns: PUBLIKASI_COLUMNS,
    applicableTo: ['S'],
  },
  '4a': {
    sheetName: '4a', sheetTitle: 'Tabel 4: Profil Dosen', criteriaCode: '4',
    headerRows: 10, rowType: 'free',
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'nama_dosen', label: 'Nama Dosen', type: 'text' },
      { key: 'nidn', label: 'NIDN/NIDK/NUPTK', type: 'text' },
      { key: 'kategori_dosen', label: 'Kategori Dosen', type: 'text' },
      { key: 'prodi_s1', label: 'Nama Prodi Studi - Sarjana/Sarjana Terapan', type: 'text' },
      { key: 'prodi_s2', label: 'Nama Prodi Studi - Magister/Magister Terapan', type: 'text' },
      { key: 'prodi_s3', label: 'Nama Prodi Studi - Doktor/Doktor Terapan', type: 'text' },
      { key: 'bidang_keahlian', label: 'Bidang Keahlian', type: 'text' },
      { key: 'perusahaan_industri', label: 'Perusahaan/Industri', type: 'text' },
      { key: 'kesesuaian_kompetensi', label: 'Kesesuaian dengan Kompetensi Inti PS', type: 'text' },
      { key: 'jabatan_akademik', label: 'Jabatan Akademik', type: 'select', options: ['Pengajar', 'Asisten Ahli', 'Lektor', 'Lektor Kepala', 'Guru Besar'] },
      { key: 'nomor_serdos', label: 'Nomor Sertifikat Pendidik Profesional', type: 'text' },
      { key: 'bidang_sertifikasi', label: 'Sertifikat Kompetensi - Bidang Sertifikasi', type: 'text' },
      { key: 'lembaga_sertifikasi', label: 'Sertifikat Kompetensi - Lembaga Penerbit', type: 'text' },
      { key: 'skip', label: 'Sertifikat Keinsinyuran - SKIP', type: 'text' },
      { key: 'stri', label: 'Sertifikat Keinsinyuran - STRI', type: 'text' },
      { key: 'mk_diampu_ps', label: 'Mata Kuliah yang Diampu pada PS yang Diakreditasi', type: 'text' },
      { key: 'kesesuaian_mk', label: 'Kesesuaian Bidang Keahlian dengan MK yang Diampu', type: 'text' },
      { key: 'mk_diampu_lain', label: 'Mata Kuliah yang Diampu pada PS Lain', type: 'text' },
    ],
    applicableTo: ['S'],
  },
  '4b': {
    sheetName: '4b', sheetTitle: 'Tabel 4b: Laboran/Teknisi/Admin Sistem', criteriaCode: '4',
    headerRows: 8, rowType: 'free',
    columns: [
      { key: 'no', label: 'No', type: 'number' },
      { key: 'nama', label: 'Nama Laboran/Teknisi/Administrator Sistem', type: 'text' },
      { key: 'pendidikan_s3', label: 'Pendidikan - S3', type: 'boolean' },
      { key: 'pendidikan_s2', label: 'Pendidikan - S2', type: 'boolean' },
      { key: 'pendidikan_s1', label: 'Pendidikan - S1', type: 'boolean' },
      { key: 'pendidikan_d4', label: 'Pendidikan - D4', type: 'boolean' },
      { key: 'pendidikan_d3', label: 'Pendidikan - D3', type: 'boolean' },
      { key: 'pendidikan_d2', label: 'Pendidikan - D2', type: 'boolean' },
      { key: 'pendidikan_d1', label: 'Pendidikan - D1', type: 'boolean' },
      { key: 'pendidikan_sma', label: 'Pendidikan - SMA/SMK', type: 'boolean' },
      { key: 'sertifikat_kompetensi', label: 'Sertifikat Kompetensi', type: 'text' },
      { key: 'unit_kerja', label: 'Unit Kerja', type: 'text' },
    ],
    applicableTo: ['S'],
  },
  '4c': {
    sheetName: '4c', sheetTitle: 'Tabel 4c: Beban Kerja Dosen', criteriaCode: '4',
    headerRows: 8, rowType: 'free',
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'nama_dosen', label: 'Nama Dosen (DT)', type: 'text' },
      { key: 'dtps', label: 'DTPS', type: 'boolean' },
      { key: 'bk_ps_diakreditasi', label: 'Beban Kerja - PS yang Diakreditasi', type: 'number' },
      { key: 'bk_ps_lain_dalam', label: 'Beban Kerja - PS Lain di dalam PT', type: 'number' },
      { key: 'bk_ps_lain_luar', label: 'Beban Kerja - PS Lain di luar PT', type: 'number' },
      { key: 'bk_penelitian', label: 'Beban Kerja - Penelitian', type: 'number' },
      { key: 'bk_pkm', label: 'Beban Kerja - PkM', type: 'number' },
      { key: 'bk_tugas_tambahan', label: 'Beban Kerja - Tugas Tambahan dan/atau Penunjang', type: 'number' },
      { key: 'jumlah_per_tahun', label: 'Jumlah per Tahun (sks)', type: 'number', autoCalculated: true },
      { key: 'jumlah_per_semester', label: 'Jumlah per Semester (sks)', type: 'number', autoCalculated: true },
    ],
    applicableTo: ['S'],
  },
  '4d': {
    sheetName: '4d', sheetTitle: 'Tabel 4d: Publikasi Dosen', criteriaCode: '4',
    headerRows: 5, rowType: 'fixed',
    fixedRows: ['Jurnal Nasional', 'Jurnal Nasional Terakreditasi', 'Jurnal Internasional', 'Jurnal Internasional Bereputasi', 'Prosiding Nasional', 'Prosiding Internasional', 'Prosiding Internasional Terindeks'],
    columns: PUBLIKASI_COLUMNS,
    applicableTo: ['S'],
  },
  '4e': {
    sheetName: '4e', sheetTitle: 'Tabel 4e: Karya Ilmiah Dosen', criteriaCode: '4',
    headerRows: 5, rowType: 'fixed',
    fixedRows: ['Buku', 'Buku Ajar', 'Modul', 'Diktat', 'Laporan', 'Lainnya'],
    columns: PUBLIKASI_COLUMNS,
    applicableTo: ['S'],
  },
  '4f-1': { sheetName: '4f-1', sheetTitle: 'Tabel 4.f.1: Luaran Dosen - Paten', criteriaCode: '4', headerRows: 5, rowType: 'free', columns: HKIPATEN_COLUMNS, applicableTo: ['S'] },
  '4f-2': { sheetName: '4f-2', sheetTitle: 'Tabel 4.f.2: Luaran Dosen - HKI', criteriaCode: '4', headerRows: 5, rowType: 'free', columns: HKIHAKCIP_COLUMNS, applicableTo: ['S'] },
  '4f-3': { sheetName: '4f-3', sheetTitle: 'Tabel 4.f.3: Luaran Dosen - Teknologi (TKT)', criteriaCode: '4', headerRows: 5, rowType: 'free', columns: HKITKT_COLUMNS, applicableTo: ['S'] },
  '4f-4': { sheetName: '4f-4', sheetTitle: 'Tabel 4.f.4: Luaran Dosen - Buku', criteriaCode: '4', headerRows: 5, rowType: 'free', columns: HKIBUKU_COLUMNS, applicableTo: ['S'] },
  '4g': {
    sheetName: '4g', sheetTitle: 'Tabel 4g: Produk/Jasa Dosen', criteriaCode: '4',
    headerRows: 4, rowType: 'free',
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'nama_dtps', label: 'Nama DTPS', type: 'text' },
      { key: 'nama_produk_jasa', label: 'Nama Produk/Jasa', type: 'text' },
      { key: 'deskripsi', label: 'Deskripsi Produk/Jasa', type: 'textarea' },
      { key: 'bukti', label: 'Bukti', type: 'url' },
    ],
    applicableTo: ['S'],
  },
  '4h': {
    sheetName: '4h', sheetTitle: 'Tabel 4h: Publikasi Internasional Bereputasi', criteriaCode: '4',
    headerRows: 12, rowType: 'free',
    columns: [
      { key: 'no', label: 'No', type: 'number' },
      { key: 'nama_dtps', label: 'Nama DTPS', type: 'text' },
      { key: 'judul_publikasi', label: 'Jurnal/Prosiding/Paten', type: 'text' },
      { key: 'keterangan', label: 'Keterangan', type: 'text' },
      { key: 'jumlah_publikasi', label: 'Jumlah Publikasi', type: 'number' },
    ],
    applicableTo: ['S'],
  },
  '4i': {
    sheetName: '4i', sheetTitle: 'Tabel 4i: Sitasi Karya Ilmiah Dosen', criteriaCode: '4',
    headerRows: 4, rowType: 'free',
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'nama_dtps', label: 'Nama DTPS', type: 'text' },
      { key: 'judul_artikel', label: 'Judul Artikel yang Disitasi', type: 'textarea' },
      { key: 'jumlah_sitasi', label: 'Jumlah Sitasi', type: 'number' },
    ],
    applicableTo: ['S'],
  },
  '4j': {
    sheetName: '4j', sheetTitle: 'Tabel 4j: Rekognisi Dosen', criteriaCode: '4',
    headerRows: 10, rowType: 'free',
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'nama_dtps', label: 'Nama DTPS', type: 'text' },
      { key: 'bidang_keahlian', label: 'Bidang Keahlian', type: 'text' },
      { key: 'rekognisi', label: 'Rekognisi', type: 'text' },
      { key: 'bukti_pendukung', label: 'Bukti Pendukung', type: 'url' },
      { key: 'tingkat_wilayah', label: 'Tingkat: Wilayah', type: 'boolean' },
      { key: 'tingkat_nasional', label: 'Tingkat: Nasional', type: 'boolean' },
      { key: 'tingkat_internasional', label: 'Tingkat: Internasional', type: 'boolean' },
      { key: 'tahun', label: 'Tahun (YYYY)', type: 'number' },
    ],
    applicableTo: ['S'],
  },
  '4k': {
    sheetName: '4k', sheetTitle: 'Tabel 4k: Dosen Pembimbing Industri / PPI', criteriaCode: '4',
    headerRows: 5, rowType: 'free',
    columns: [
      { key: 'no', label: 'No', type: 'number' },
      { key: 'nama', label: 'Nama', type: 'text' },
      { key: 'industri', label: 'Industri', type: 'text' },
      { key: 'bidang_keinsinyuran', label: 'Bidang Keinsinyuran', type: 'text' },
      { key: 'pengalaman_kerja', label: 'Pengalaman Kerja (tahun)', type: 'number' },
      { key: 'pendidikan', label: 'Pendidikan Tinggi', type: 'text' },
      { key: 'kategori_ipm', label: 'Kategori SIP - IPM', type: 'boolean' },
      { key: 'kategori_ipu', label: 'Kategori SIP - IPU', type: 'boolean' },
      { key: 'nomor_sip', label: 'Nomor SIP', type: 'text' },
      { key: 'tgl_berakhir_sip', label: 'Tanggal Berakhir SIP (HH/BB/TTTT)', type: 'date' },
      { key: 'jumlah_bimbingan', label: 'Jumlah Bimbingan dalam 3 tahun', type: 'number' },
    ],
    applicableTo: ['S'],
  },
  '5a': {
    sheetName: '5a', sheetTitle: 'Tabel 5a: Prasarana dan Sarana Laboratorium', criteriaCode: '5',
    headerRows: 8, rowType: 'free',
    columns: [
      { key: 'no', label: 'No', type: 'number' },
      { key: 'nama_prasarana', label: 'Nama Prasarana', type: 'text' },
      { key: 'jumlah_prasarana', label: 'Jumlah Prasarana', type: 'number' },
      { key: 'nama_sarana', label: 'Nama Sarana/Alat/Peraga', type: 'text' },
      { key: 'jumlah_alat_standar', label: 'Jumlah Alat - Standar Minimal', type: 'number' },
      { key: 'jumlah_alat_dimiliki', label: 'Jumlah Alat - Yang Dimiliki UPPS', type: 'number' },
      { key: 'kepemilikan_sendiri', label: 'Kepemilikan - Sendiri', type: 'boolean' },
      { key: 'kepemilikan_sewa', label: 'Kepemilikan - Sewa', type: 'boolean' },
      { key: 'kondisi_terawat', label: 'Kondisi - Terawat', type: 'boolean' },
      { key: 'kondisi_tidak_terawat', label: 'Kondisi - Tidak Terawat', type: 'boolean' },
      { key: 'logbook_ada', label: 'Logbook - Ada', type: 'boolean' },
      { key: 'logbook_tidak_ada', label: 'Logbook - Tidak Ada', type: 'boolean' },
      { key: 'waktu_penggunaan', label: 'Rata-rata Waktu Penggunaan (Jam/Minggu)', type: 'number' },
    ],
    applicableTo: ['S'],
  },
  '5b': {
    sheetName: '5b', sheetTitle: 'Tabel 5b: Dokumen Sistem Penjaminan Mutu', criteriaCode: '5',
    headerRows: 3, rowType: 'free',
    columns: [
      { key: 'no', label: 'No', type: 'number' },
      { key: 'jenis_dokumen', label: 'Jenis Dokumen', type: 'text' },
      { key: 'jumlah', label: 'Jumlah', type: 'number' },
      { key: 'riwayat_pengesahan', label: 'Riwayat Pengesahan', type: 'text' },
    ],
    applicableTo: ['S'],
  },
  '5c': {
    sheetName: '5c', sheetTitle: 'Tabel 5c: Sarana Teknologi Informasi', criteriaCode: '5',
    headerRows: 3, rowType: 'free',
    columns: [
      { key: 'no', label: 'No', type: 'number' },
      { key: 'nama_sarana', label: 'Nama Sarana', type: 'text' },
      { key: 'fungsi', label: 'Fungsi', type: 'text' },
      { key: 'jumlah_unit', label: 'Jumlah Unit', type: 'number' },
      { key: 'kondisi', label: 'Kondisi', type: 'text' },
    ],
    applicableTo: ['S'],
  },
  '6a': {
    sheetName: '6a', sheetTitle: 'Tabel 6.a: Jumlah Mahasiswa', criteriaCode: '6',
    headerRows: 5, rowType: 'free',
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'program_studi', label: 'Program Studi', type: 'text' },
      { key: 'prodi_diakreditasi', label: 'Prodi yang Diakreditasi', type: 'boolean' },
      { key: 'aktif_ts_minus2', label: 'Mahasiswa Aktif - TS-2', type: 'number' },
      { key: 'aktif_ts_minus1', label: 'Mahasiswa Aktif - TS-1', type: 'number' },
      { key: 'aktif_ts', label: 'Mahasiswa Aktif - TS', type: 'number' },
      { key: 'asing_ft_ts_minus2', label: 'Asing Full-time - TS-2', type: 'number' },
      { key: 'asing_ft_ts_minus1', label: 'Asing Full-time - TS-1', type: 'number' },
      { key: 'asing_ft_ts', label: 'Asing Full-time - TS', type: 'number' },
      { key: 'asing_pt_ts_minus2', label: 'Asing Part-time - TS-2', type: 'number' },
      { key: 'asing_pt_ts_minus1', label: 'Asing Part-time - TS-1', type: 'number' },
      { key: 'asing_pt_ts', label: 'Asing Part-time - TS', type: 'number' },
    ],
    applicableTo: ['S'],
  },
  '6b': {
    sheetName: '6b', sheetTitle: 'Tabel 6.b: IPK Lulusan', criteriaCode: '6',
    headerRows: 5, rowType: 'fixed', fixedRows: ['TS-2', 'TS-1', 'TS'],
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'tahun_lulus', label: 'Tahun Lulus', type: 'text' },
      { key: 'jumlah_lulusan', label: 'Jumlah Lulusan', type: 'number' },
      { key: 'ipk_min', label: 'IPK - Min.', type: 'number' },
      { key: 'ipk_rata', label: 'IPK - Rata-rata', type: 'number' },
      { key: 'ipk_maks', label: 'IPK - Maks', type: 'number' },
    ],
    applicableTo: ['S'],
  },
  '6c1': { sheetName: '6c1', sheetTitle: 'Tabel 6.c.1: Prestasi Akademik Mahasiswa', criteriaCode: '6', headerRows: 7, rowType: 'free', columns: PRESTASI_COLUMNS, applicableTo: ['S'] },
  '6c2': { sheetName: '6c2', sheetTitle: 'Tabel 6.c.2: Prestasi Non-Akademik Mahasiswa', criteriaCode: '6', headerRows: 7, rowType: 'free', columns: PRESTASI_COLUMNS, applicableTo: ['S'] },
  '6d': {
    sheetName: '6d', sheetTitle: 'Tabel 6.d: Masa Studi Lulusan', criteriaCode: '6',
    headerRows: 3, rowType: 'form',
    columns: [
      { key: 'tahun_masuk', label: 'Tahun Masuk', type: 'text' },
      { key: 'jumlah_masuk', label: 'Jumlah Mahasiswa Masuk', type: 'number' },
      { key: 'jumlah_lulus', label: 'Jumlah Mahasiswa Lulus', type: 'number' },
    ],
    applicableTo: ['S'],
  },
  '6e1': { sheetName: '6e1', sheetTitle: 'Tabel 6.e.1: Publikasi Mahasiswa (Jurnal)', criteriaCode: '6', headerRows: 5, rowType: 'fixed', fixedRows: ['Jurnal Nasional', 'Jurnal Nasional Terakreditasi', 'Jurnal Internasional', 'Jurnal Internasional Bereputasi', 'Prosiding Nasional', 'Prosiding Internasional', 'Prosiding Internasional Terindeks'], columns: PUBLIKASI_COLUMNS, applicableTo: ['S'] },
  '6e2': { sheetName: '6e2', sheetTitle: 'Tabel 6.e.2: Publikasi Mahasiswa (Prosiding/Buku)', criteriaCode: '6', headerRows: 5, rowType: 'fixed', fixedRows: ['Prosiding Nasional', 'Prosiding Internasional', 'Prosiding Terindeks', 'Buku', 'Modul', 'Lainnya'], columns: PUBLIKASI_COLUMNS, applicableTo: ['S'] },
  '6e3-1': { sheetName: '6e3-1', sheetTitle: 'Tabel 6.e.3.1: Luaran Mahasiswa - Paten', criteriaCode: '6', headerRows: 5, rowType: 'free', columns: [...HKIPATEN_COLUMNS.slice(0,3), { key: 'status', label: 'Status (Registered/Granted/Komersial)', type: 'text' }, { key: 'nomor_registrasi', label: 'Nomor Registrasi/Paten', type: 'text' }], applicableTo: ['S'] },
  '6e3-2': { sheetName: '6e3-2', sheetTitle: 'Tabel 6.e.3.2: Luaran Mahasiswa - HKI', criteriaCode: '6', headerRows: 5, rowType: 'free', columns: [...HKIHAKCIP_COLUMNS.slice(0,3), { key: 'nomor_hki', label: 'Nomor HKI', type: 'text' }], applicableTo: ['S'] },
  '6e3-3': { sheetName: '6e3-3', sheetTitle: 'Tabel 6.e.3.3: Luaran Mahasiswa - Teknologi (TKT)', criteriaCode: '6', headerRows: 5, rowType: 'free', columns: HKITKT_COLUMNS, applicableTo: ['S'] },
  '6e3-4': { sheetName: '6e3-4', sheetTitle: 'Tabel 6.e.3.4: Luaran Mahasiswa - Buku', criteriaCode: '6', headerRows: 5, rowType: 'free', columns: HKIBUKU_COLUMNS, applicableTo: ['S'] },
  '6e4': {
    sheetName: '6e4', sheetTitle: 'Tabel 6.e.4: Produk/Jasa Mahasiswa', criteriaCode: '6',
    headerRows: 4, rowType: 'free',
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'nama_mahasiswa', label: 'Nama Mahasiswa', type: 'text' },
      { key: 'nama_produk_jasa', label: 'Nama Produk/Jasa', type: 'text' },
      { key: 'deskripsi', label: 'Deskripsi Produk/Jasa', type: 'textarea' },
      { key: 'bukti', label: 'Bukti', type: 'url' },
    ],
    applicableTo: ['S'],
  },
  '6f1': {
    sheetName: '6f1', sheetTitle: 'Tabel 6.f.1: Waktu Tunggu Lulusan', criteriaCode: '6',
    headerRows: 5, rowType: 'form',
    columns: [
      { key: 'tahun_lulus', label: 'Tahun Lulus', type: 'text' },
      { key: 'jumlah_lulusan', label: 'Jumlah Lulusan', type: 'number' },
      { key: 'jumlah_terlacak', label: 'Jumlah Lulusan yang Terlacak', type: 'number' },
      { key: 'dipesan_sebelum_lulus', label: 'Jumlah Lulusan yang Dipesan Sebelum Lulus', type: 'number' },
      { key: 'waktu_tunggu_kurang3', label: 'Waktu Tunggu < 3 bulan', type: 'number' },
      { key: 'waktu_tunggu_3_6', label: 'Waktu Tunggu 3-6 bulan', type: 'number' },
      { key: 'waktu_tunggu_lebih6', label: 'Waktu Tunggu > 6 bulan', type: 'number' },
    ],
    applicableTo: ['S'],
  },
  '6f2': {
    sheetName: '6f2', sheetTitle: 'Tabel 6.f.2: Kesesuaian Bidang Kerja Lulusan', criteriaCode: '6',
    headerRows: 5, rowType: 'form',
    columns: [
      { key: 'tahun_lulus', label: 'Tahun Lulus', type: 'text' },
      { key: 'jumlah_lulusan', label: 'Jumlah Lulusan', type: 'number' },
      { key: 'jumlah_terlacak', label: 'Jumlah Lulusan yang Terlacak', type: 'number' },
      { key: 'kesesuaian_rendah', label: 'Kesesuaian - Rendah', type: 'number' },
      { key: 'kesesuaian_sedang', label: 'Kesesuaian - Sedang', type: 'number' },
      { key: 'kesesuaian_tinggi', label: 'Kesesuaian - Tinggi', type: 'number' },
    ],
    applicableTo: ['S'],
  },
  '6g1': {
    sheetName: '6g1', sheetTitle: 'Tabel 6.g.1: Tempat Kerja Lulusan', criteriaCode: '6',
    headerRows: 5, rowType: 'form',
    columns: [
      { key: 'tahun_lulus', label: 'Tahun Lulus', type: 'text' },
      { key: 'jumlah_lulusan', label: 'Jumlah Lulusan', type: 'number' },
      { key: 'pengguna_memberi_tanggapan', label: 'Jumlah Pengguna Lulusan yang Memberi Tanggapan', type: 'number' },
      { key: 'jumlah_terlacak', label: 'Jumlah Lulusan yang Terlacak', type: 'number' },
      { key: 'tempat_lokal', label: 'Tingkat Lokal/Wilayah', type: 'number' },
      { key: 'tempat_nasional', label: 'Tingkat Nasional', type: 'number' },
      { key: 'tempat_multinasional', label: 'Tingkat Multinasional', type: 'number' },
    ],
    applicableTo: ['S'],
  },
  '6g2': {
    sheetName: '6g2', sheetTitle: 'Tabel 6.g.2: Kepuasan Pengguna Lulusan', criteriaCode: '6',
    headerRows: 5, rowType: 'fixed',
    fixedRows: ['Etika', 'Keahlian Bidang Ilmu', 'Bahasa Asing', 'Teknologi Informasi', 'Komunikasi', 'Kerjasama Tim', 'Pengembangan Diri'],
    columns: [
      { key: 'no', label: 'No', type: 'number' },
      { key: 'jenis_kemampuan', label: 'Jenis Kemampuan', type: 'text' },
      { key: 'sangat_baik', label: 'Tingkat Kepuasan - Sangat Baik (%)', type: 'number' },
      { key: 'baik', label: 'Tingkat Kepuasan - Baik (%)', type: 'number' },
      { key: 'cukup', label: 'Tingkat Kepuasan - Cukup (%)', type: 'number' },
      { key: 'kurang', label: 'Tingkat Kepuasan - Kurang (%)', type: 'number' },
      { key: 'rencana_tindak_lanjut', label: 'Rencana Tindak Lanjut oleh UPPS/PS', type: 'textarea' },
    ],
    applicableTo: ['S'],
  },
  '6h1': { sheetName: '6h1', sheetTitle: 'Tabel 6.h.1: Keterlibatan Mahasiswa dalam Penelitian Dosen', criteriaCode: '6', headerRows: 8, rowType: 'free', columns: [{ key: 'no', label: 'No.', type: 'number' }, { key: 'nama_dosen', label: 'Nama Dosen', type: 'text' }, { key: 'tema_penelitian', label: 'Tema Penelitian sesuai Peta Jalan', type: 'text' }, { key: 'nama_mahasiswa', label: 'Nama Mahasiswa', type: 'text' }, { key: 'judul_kegiatan', label: 'Judul Kegiatan', type: 'text' }, { key: 'tahun', label: 'Tahun (YYYY)', type: 'number' }], applicableTo: ['S'] },
  '6h2': { sheetName: '6h2', sheetTitle: 'Tabel 6.h.2: Keterlibatan Mahasiswa dalam Tesis/Disertasi', criteriaCode: '6', headerRows: 4, rowType: 'free', columns: [{ key: 'no', label: 'No.', type: 'number' }, { key: 'nama_dosen', label: 'Nama Dosen', type: 'text' }, { key: 'tema_penelitian', label: 'Tema Penelitian sesuai Roadmap', type: 'text' }, { key: 'nama_mahasiswa', label: 'Nama Mahasiswa', type: 'text' }, { key: 'judul_tesis_disertasi', label: 'Judul Tesis/Disertasi', type: 'text' }, { key: 'tahun', label: 'Tahun (YYYY)', type: 'number' }], applicableTo: ['S'] },
  '6i': { sheetName: '6i', sheetTitle: 'Tabel 6.i: Keterlibatan Mahasiswa dalam PkM Dosen', criteriaCode: '6', headerRows: 4, rowType: 'free', columns: [{ key: 'no', label: 'No.', type: 'number' }, { key: 'nama_dosen', label: 'Nama Dosen', type: 'text' }, { key: 'tema_pkm', label: 'Tema PkM sesuai Peta Jalan', type: 'text' }, { key: 'nama_mahasiswa', label: 'Nama Mahasiswa', type: 'text' }, { key: 'judul_pkm', label: 'Judul Kegiatan PkM', type: 'text' }, { key: 'tahun', label: 'Tahun (YYYY)', type: 'number' }], applicableTo: ['S'] },
  '7a': {
    sheetName: '7a', sheetTitle: 'Tabel 7.a: Dokumen Penjaminan Mutu', criteriaCode: '7',
    headerRows: 3, rowType: 'fixed', fixedRows: ['Kebijakan SPMI', 'Pedoman PPEPP', 'Standar Mutu', 'Tata Cara Dokumentasi'],
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'jenis_dokumen', label: 'Jenis Dokumen Penjaminan Mutu', type: 'text' },
      { key: 'no_dokumen', label: 'No Dokumen', type: 'text' },
      { key: 'tanggal_dokumen', label: 'Tanggal Dokumen', type: 'date' },
    ],
    applicableTo: ['S'],
  },
  '7b': {
    sheetName: '7b', sheetTitle: 'Tabel 7.b: Laporan Audit Mutu Internal', criteriaCode: '7',
    headerRows: 3, rowType: 'fixed', fixedRows: ['Penetapan', 'Pelaksanaan', 'Evaluasi', 'Pengendalian', 'Peningkatan'],
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'dokumen', label: 'Dokumen', type: 'text' },
      { key: 'link_dokumen', label: 'Link Dokumen', type: 'url' },
      { key: 'link_hasil_audit', label: 'Link Laporan Hasil Audit', type: 'url' },
      { key: 'link_rtm', label: 'Link Laporan RTM', type: 'url' },
      { key: 'link_peningkatan', label: 'Link Dokumen Peningkatan', type: 'url' },
    ],
    applicableTo: ['S'],
  },
};

// ============================================================
// FORMAT LAM_TEKNIK
// (Prodi keteknikan selain Informatika & STI)
// ============================================================
export const LKPS_SHEETS_LAMTEKNIK: Record<string, LKPSSheetConfig> = {
  PS: {
    sheetName: 'PS', sheetTitle: 'Daftar Program Studi di UPPS', criteriaCode: '0',
    headerRows: 10, rowType: 'free', columns: PS_COLUMNS, applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'],
  },
  '1-1': { sheetName: '1-1', sheetTitle: 'Tabel 1 Bagian 1: Kerjasama Pendidikan', criteriaCode: '1', headerRows: 11, rowType: 'free', columns: COLLABORATION_COLUMNS, applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'] },
  '1-2': { sheetName: '1-2', sheetTitle: 'Tabel 1 Bagian 2: Kerjasama Penelitian', criteriaCode: '1', headerRows: 11, rowType: 'free', columns: COLLABORATION_COLUMNS, applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'] },
  '1-3': { sheetName: '1-3', sheetTitle: 'Tabel 1 Bagian 3: Kerjasama PkM', criteriaCode: '1', headerRows: 11, rowType: 'free', columns: COLLABORATION_COLUMNS, applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'] },
  '2a1': {
    sheetName: '2a1', sheetTitle: 'Tabel 2.a.1: Seleksi Mahasiswa S1/S.Tr/S2/M.Tr/S3/D.Tr', criteriaCode: '2', subCriteriaCode: '2a',
    headerRows: 5, rowType: 'form',
    columns: [
      { key: 'tahun_akademik', label: 'Tahun Akademik', type: 'text' },
      { key: 'daya_tampung', label: 'Daya Tampung', type: 'number' },
      { key: 'jumlah_calon', label: 'Jumlah Calon Mahasiswa', type: 'number' },
      { key: 'jumlah_baru', label: 'Jumlah Mahasiswa Baru', type: 'number' },
      { key: 'jumlah_aktif', label: 'Jumlah Mahasiswa Aktif', type: 'number' },
    ],
    applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr'],
  },
  '2a2': {
    sheetName: '2a2', sheetTitle: 'Tabel 2.a.2: Seleksi Mahasiswa D3', criteriaCode: '2', subCriteriaCode: '2a',
    headerRows: 5, rowType: 'form',
    columns: [
      { key: 'tahun_akademik', label: 'Tahun Akademik', type: 'text' },
      { key: 'daya_tampung', label: 'Daya Tampung', type: 'number' },
      { key: 'jumlah_calon', label: 'Jumlah Calon Mahasiswa', type: 'number' },
      { key: 'jumlah_baru', label: 'Jumlah Mahasiswa Baru', type: 'number' },
      { key: 'jumlah_aktif', label: 'Jumlah Mahasiswa Aktif', type: 'number' },
    ],
    applicableTo: ['D3'],
  },
  '2a3': {
    sheetName: '2a3', sheetTitle: 'Tabel 2.a.3: Seleksi Mahasiswa D2', criteriaCode: '2', subCriteriaCode: '2a',
    headerRows: 5, rowType: 'form',
    columns: [
      { key: 'tahun_akademik', label: 'Tahun Akademik', type: 'text' },
      { key: 'daya_tampung', label: 'Daya Tampung', type: 'number' },
      { key: 'jumlah_calon', label: 'Jumlah Calon Mahasiswa', type: 'number' },
      { key: 'jumlah_baru', label: 'Jumlah Mahasiswa Baru', type: 'number' },
      { key: 'jumlah_aktif', label: 'Jumlah Mahasiswa Aktif', type: 'number' },
    ],
    applicableTo: ['D2'],
  },
  '2a4': {
    sheetName: '2a4', sheetTitle: 'Tabel 2.a.4: Seleksi Mahasiswa D1', criteriaCode: '2', subCriteriaCode: '2a',
    headerRows: 5, rowType: 'form',
    columns: [
      { key: 'tahun_akademik', label: 'Tahun Akademik', type: 'text' },
      { key: 'daya_tampung', label: 'Daya Tampung', type: 'number' },
      { key: 'jumlah_calon', label: 'Jumlah Calon Mahasiswa', type: 'number' },
      { key: 'jumlah_baru', label: 'Jumlah Mahasiswa Baru', type: 'number' },
      { key: 'jumlah_aktif', label: 'Jumlah Mahasiswa Aktif', type: 'number' },
    ],
    applicableTo: ['D1'],
  },
  '2b': {
    sheetName: '2b', sheetTitle: 'Tabel 2b: Jumlah Mahasiswa per Program Studi', criteriaCode: '2', subCriteriaCode: '2b',
    headerRows: 5, rowType: 'free',
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'program_studi', label: 'Program Studi', type: 'text' },
      { key: 'aktif_ts_minus2', label: 'Mahasiswa Aktif - TS-2', type: 'number' },
      { key: 'aktif_ts_minus1', label: 'Mahasiswa Aktif - TS-1', type: 'number' },
      { key: 'aktif_ts', label: 'Mahasiswa Aktif - TS', type: 'number' },
      { key: 'asing_ft_ts_minus2', label: 'Asing Full-time - TS-2', type: 'number' },
      { key: 'asing_ft_ts_minus1', label: 'Asing Full-time - TS-1', type: 'number' },
      { key: 'asing_ft_ts', label: 'Asing Full-time - TS', type: 'number' },
      { key: 'asing_pt_ts_minus2', label: 'Asing Part-time - TS-2', type: 'number' },
      { key: 'asing_pt_ts_minus1', label: 'Asing Part-time - TS-1', type: 'number' },
      { key: 'asing_pt_ts', label: 'Asing Part-time - TS', type: 'number' },
      { key: 'info', label: 'Info', type: 'text' },
    ],
    applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'],
  },
  '3a1': {
    sheetName: '3a1', sheetTitle: 'Tabel 3.a.1: Profil Dosen Tetap', criteriaCode: '3', subCriteriaCode: '3a',
    headerRows: 10, rowType: 'free',
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'nama_dosen', label: 'Nama Dosen', type: 'text' },
      { key: 'nidn', label: 'NIDN/NIDK', type: 'text' },
      { key: 'prodi_s2', label: 'Nama Prodi Pasca - Magister/Magister Terapan', type: 'text' },
      { key: 'prodi_s3', label: 'Nama Prodi Pasca - Doktor/Doktor Terapan', type: 'text' },
      { key: 'bidang_keahlian', label: 'Bidang Keahlian', type: 'text' },
      { key: 'kesesuaian_kompetensi', label: 'Kesesuaian dengan Kompetensi Inti PS', type: 'text' },
      { key: 'jabatan_akademik', label: 'Jabatan Akademik', type: 'select', options: ['Pengajar', 'Asisten Ahli', 'Lektor', 'Lektor Kepala', 'Guru Besar'] },
      { key: 'nomor_serdos', label: 'Nomor Sertifikat Pendidik Profesional', type: 'text' },
      { key: 'bidang_sertifikasi', label: 'Sertifikat Kompetensi - Bidang Sertifikasi', type: 'text' },
      { key: 'lembaga_sertifikasi', label: 'Sertifikat Kompetensi - Lembaga Penerbit', type: 'text' },
      { key: 'mk_diampu_ps', label: 'Mata Kuliah yang Diampu pada PS yang Diakreditasi', type: 'text' },
      { key: 'kesesuaian_mk', label: 'Kesesuaian Bidang Keahlian dengan MK yang Diampu', type: 'text' },
      { key: 'mk_diampu_lain', label: 'Mata Kuliah yang Diampu pada PS Lain', type: 'text' },
    ],
    applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'],
  },
  '3a2': {
    sheetName: '3a2', sheetTitle: 'Tabel 3.a.2: Bimbingan Tugas Akhir/Skripsi', criteriaCode: '3', subCriteriaCode: '3a',
    headerRows: 10, rowType: 'free',
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'nama_dosen', label: 'Nama Dosen', type: 'text' },
      { key: 'bimbing_ps_ts_minus2', label: 'Bimbing PS - TS-2', type: 'number' },
      { key: 'bimbing_ps_ts_minus1', label: 'Bimbing PS - TS-1', type: 'number' },
      { key: 'bimbing_ps_ts', label: 'Bimbing PS - TS', type: 'number' },
      { key: 'bimbing_ps_rata', label: 'Bimbing PS - Rata-rata', type: 'number', autoCalculated: true },
      { key: 'bimbing_lain_ts_minus2', label: 'Bimbing PS Lain - TS-2', type: 'number' },
      { key: 'bimbing_lain_ts_minus1', label: 'Bimbing PS Lain - TS-1', type: 'number' },
      { key: 'bimbing_lain_ts', label: 'Bimbing PS Lain - TS', type: 'number' },
      { key: 'bimbing_lain_rata', label: 'Bimbing PS Lain - Rata-rata', type: 'number', autoCalculated: true },
      { key: 'rata_semua', label: 'Rata-rata Semua Program/Semester', type: 'number', autoCalculated: true },
      { key: 'sk_ts_minus2', label: 'No. SK Penugasan - TS-2', type: 'text' },
      { key: 'sk_ts_minus1', label: 'No. SK Penugasan - TS-1', type: 'text' },
      { key: 'sk_ts', label: 'No. SK Penugasan - TS', type: 'text' },
    ],
    applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'],
  },
  '3a3': {
    sheetName: '3a3', sheetTitle: 'Tabel 3.a.3: Beban Kerja Dosen (EWMP)', criteriaCode: '3', subCriteriaCode: '3a',
    headerRows: 10, rowType: 'free',
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'nama_dosen', label: 'Nama Dosen (DT)', type: 'text' },
      { key: 'dtps', label: 'DTPS', type: 'boolean' },
      { key: 'ewmp_ps_diakreditasi', label: 'EWMP Pendidikan - PS yang Diakreditasi', type: 'number' },
      { key: 'ewmp_ps_lain_dalam', label: 'EWMP Pendidikan - PS Lain di dalam PT', type: 'number' },
      { key: 'ewmp_ps_lain_luar', label: 'EWMP Pendidikan - PS Lain di luar PT', type: 'number' },
      { key: 'ewmp_penelitian', label: 'EWMP - Penelitian', type: 'number' },
      { key: 'ewmp_pkm', label: 'EWMP - PkM', type: 'number' },
      { key: 'ewmp_tugas_tambahan', label: 'EWMP - Tugas Tambahan dan/atau Penunjang', type: 'number' },
      { key: 'jumlah_per_tahun', label: 'Jumlah per Tahun (sks)', type: 'number', autoCalculated: true },
      { key: 'jumlah_per_semester', label: 'Jumlah per Semester (sks)', type: 'number', autoCalculated: true },
    ],
    applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'],
  },
  '3a4': {
    sheetName: '3a4', sheetTitle: 'Tabel 3.a.4: Dosen Tidak Tetap (DTT)', criteriaCode: '3', subCriteriaCode: '3a',
    headerRows: 8, rowType: 'free',
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'nama_dosen', label: 'Nama Dosen', type: 'text' },
      { key: 'nidn', label: 'NIDN/NIDK', type: 'text' },
      { key: 'prodi_s2', label: 'Pendidikan Pasca - Magister', type: 'text' },
      { key: 'prodi_s3', label: 'Pendidikan Pasca - Doktor', type: 'text' },
      { key: 'bidang_keahlian', label: 'Bidang Keahlian', type: 'text' },
      { key: 'jabatan_akademik', label: 'Jabatan Akademik', type: 'select', options: ['Pengajar', 'Asisten Ahli', 'Lektor', 'Lektor Kepala', 'Guru Besar'] },
      { key: 'nomor_serdos', label: 'Nomor Sertifikat Pendidik Profesional', type: 'text' },
      { key: 'bidang_sertifikasi', label: 'Sertifikat Kompetensi - Bidang Sertifikasi', type: 'text' },
      { key: 'lembaga_sertifikasi', label: 'Sertifikat Kompetensi - Lembaga Penerbit', type: 'text' },
      { key: 'mk_diampu_ps', label: 'Mata Kuliah yang Diampu pada PS yang Diakreditasi', type: 'text' },
      { key: 'kesesuaian_mk', label: 'Kesesuaian Bidang Keahlian dengan MK yang Diampu', type: 'text' },
    ],
    applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'],
  },
  '3a5': {
    sheetName: '3a5', sheetTitle: 'Tabel 3.a.5: Dosen Industri/Praktisi', criteriaCode: '3', subCriteriaCode: '3a',
    headerRows: 8, rowType: 'free',
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'nama_dosen', label: 'Nama Dosen Industri/Praktisi', type: 'text' },
      { key: 'nidk', label: 'NIDK', type: 'text' },
      { key: 'perusahaan', label: 'Perusahaan/Industri', type: 'text' },
      { key: 'pendidikan', label: 'Pendidikan Tertinggi', type: 'text' },
      { key: 'bidang_keahlian', label: 'Bidang Keahlian', type: 'text' },
      { key: 'bidang_sertifikasi', label: 'Sertifikat Profesi - Bidang Sertifikasi', type: 'text' },
      { key: 'lembaga_sertifikasi', label: 'Sertifikat Profesi - Lembaga Penerbit', type: 'text' },
      { key: 'mk_diampu', label: 'Mata Kuliah yang Diampu', type: 'text' },
      { key: 'bobot_sks', label: 'Bobot Kredit (sks)', type: 'number' },
    ],
    applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'],
  },
  '3b1': {
    sheetName: '3b1', sheetTitle: 'Tabel 3.b.1: Rekognisi Dosen', criteriaCode: '3', subCriteriaCode: '3b',
    headerRows: 6, rowType: 'free',
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'nama_dosen', label: 'Nama Dosen', type: 'text' },
      { key: 'bidang_keahlian', label: 'Bidang Keahlian', type: 'text' },
      { key: 'rekognisi', label: 'Rekognisi', type: 'text' },
      { key: 'bukti_pendukung', label: 'Bukti Pendukung', type: 'url' },
      { key: 'tingkat_wilayah', label: 'Tingkat: Wilayah', type: 'boolean' },
      { key: 'tingkat_nasional', label: 'Tingkat: Nasional', type: 'boolean' },
      { key: 'tingkat_internasional', label: 'Tingkat: Internasional', type: 'boolean' },
      { key: 'tahun', label: 'Tahun (YYYY)', type: 'number' },
    ],
    applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'],
  },
  '3b2': { sheetName: '3b2', sheetTitle: 'Tabel 3.b.2: Penelitian Dosen', criteriaCode: '3', subCriteriaCode: '3b', headerRows: 6, rowType: 'fixed', fixedRows: ['PT/Mandiri', 'Dalam Negeri', 'Luar Negeri'], columns: [...PUBLIKASI_COLUMNS.slice(0,1), { key: 'sumber_pembiayaan', label: 'Sumber Pembiayaan', type: 'text' }, ...PUBLIKASI_COLUMNS.slice(2)], applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'] },
  '3b3': { sheetName: '3b3', sheetTitle: 'Tabel 3.b.3: PkM Dosen', criteriaCode: '3', subCriteriaCode: '3b', headerRows: 6, rowType: 'fixed', fixedRows: ['PT/Mandiri', 'Dalam Negeri', 'Luar Negeri'], columns: [...PUBLIKASI_COLUMNS.slice(0,1), { key: 'sumber_pembiayaan', label: 'Sumber Pembiayaan', type: 'text' }, ...PUBLIKASI_COLUMNS.slice(2)], applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'] },
  '3b4': { sheetName: '3b4', sheetTitle: 'Tabel 3.b.4: Publikasi Dosen', criteriaCode: '3', subCriteriaCode: '3b', headerRows: 5, rowType: 'fixed', fixedRows: ['Jurnal Nasional', 'Jurnal Nasional Terakreditasi', 'Jurnal Internasional', 'Jurnal Internasional Bereputasi', 'Prosiding Nasional', 'Prosiding Internasional', 'Prosiding Internasional Terindeks'], columns: PUBLIKASI_COLUMNS, applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'] },
  '3b5': { sheetName: '3b5', sheetTitle: 'Tabel 3.b.5: Karya Ilmiah Dosen', criteriaCode: '3', subCriteriaCode: '3b', headerRows: 5, rowType: 'fixed', fixedRows: ['Buku', 'Buku Ajar', 'Modul', 'Diktat', 'Laporan', 'Lainnya'], columns: PUBLIKASI_COLUMNS, applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'] },
  '3b6': {
    sheetName: '3b6', sheetTitle: 'Tabel 3.b.6: Sitasi Karya Ilmiah Dosen', criteriaCode: '3', subCriteriaCode: '3b',
    headerRows: 4, rowType: 'free',
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'nama_dosen', label: 'Nama Dosen', type: 'text' },
      { key: 'judul_artikel', label: 'Judul Artikel yang Disitasi', type: 'textarea' },
      { key: 'jumlah_sitasi', label: 'Jumlah Sitasi', type: 'number' },
    ],
    applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'],
  },
  '3b7': {
    sheetName: '3b7', sheetTitle: 'Tabel 3.b.7: Produk/Jasa Dosen', criteriaCode: '3', subCriteriaCode: '3b',
    headerRows: 4, rowType: 'free',
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'nama_dosen', label: 'Nama Dosen', type: 'text' },
      { key: 'nama_produk_jasa', label: 'Nama Produk/Jasa', type: 'text' },
      { key: 'deskripsi', label: 'Deskripsi Produk/Jasa', type: 'textarea' },
      { key: 'bukti', label: 'Bukti', type: 'url' },
    ],
    applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'],
  },
  '3b8-1': { sheetName: '3b8-1', sheetTitle: 'Luaran Dosen: Paten', criteriaCode: '3', subCriteriaCode: '3b', headerRows: 5, rowType: 'free', columns: HKIPATEN_COLUMNS, applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'] },
  '3b8-2': { sheetName: '3b8-2', sheetTitle: 'Luaran Dosen: HKI', criteriaCode: '3', subCriteriaCode: '3b', headerRows: 5, rowType: 'free', columns: HKIHAKCIP_COLUMNS, applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'] },
  '3b8-3': { sheetName: '3b8-3', sheetTitle: 'Luaran Dosen: Teknologi (TKT)', criteriaCode: '3', subCriteriaCode: '3b', headerRows: 5, rowType: 'free', columns: HKITKT_COLUMNS, applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'] },
  '3b8-4': { sheetName: '3b8-4', sheetTitle: 'Luaran Dosen: Buku', criteriaCode: '3', subCriteriaCode: '3b', headerRows: 5, rowType: 'free', columns: HKIBUKU_COLUMNS, applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'] },
  '3c': {
    sheetName: '3c', sheetTitle: 'Tabel 3.c: Tenaga Kependidikan', criteriaCode: '3', subCriteriaCode: '3c',
    headerRows: 5, rowType: 'fixed',
    fixedRows: ['Pustakawan', 'Laboran', 'Teknisi', 'Operator', 'Programer'],
    columns: [
      { key: 'no', label: 'No', type: 'number' },
      { key: 'jenis_tendik', label: 'Jenis Tenaga Kependidikan', type: 'text' },
      { key: 'jml_s3', label: 'Pendidikan Terakhir - S3', type: 'number' },
      { key: 'jml_s2', label: 'Pendidikan Terakhir - S2', type: 'number' },
      { key: 'jml_s1', label: 'Pendidikan Terakhir - S1', type: 'number' },
      { key: 'jml_d4', label: 'Pendidikan Terakhir - D4', type: 'number' },
      { key: 'jml_d3', label: 'Pendidikan Terakhir - D3', type: 'number' },
      { key: 'jml_d2', label: 'Pendidikan Terakhir - D2', type: 'number' },
      { key: 'jml_d1', label: 'Pendidikan Terakhir - D1', type: 'number' },
      { key: 'jml_sma', label: 'Pendidikan Terakhir - SMA/SMK', type: 'number' },
      { key: 'unit_kerja', label: 'Unit Kerja', type: 'text' },
    ],
    applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'],
  },
  '4a': {
    sheetName: '4a', sheetTitle: 'Tabel 4.a: Keuangan', criteriaCode: '4',
    headerRows: 5, rowType: 'fixed',
    fixedRows: ['Biaya Dosen', 'Tenaga Kependidikan', 'Operasional Pembelajaran', 'Operasional Tidak Langsung', 'Investasi', 'Penelitian', 'PkM', 'Lainnya'],
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'jenis_penggunaan', label: 'Jenis Penggunaan', type: 'text' },
      { key: 'upps_ts_minus2', label: 'UPPS - TS-2', type: 'number' },
      { key: 'upps_ts_minus1', label: 'UPPS - TS-1', type: 'number' },
      { key: 'upps_ts', label: 'UPPS - TS', type: 'number' },
      { key: 'upps_rata', label: 'UPPS - Rata-rata', type: 'number', autoCalculated: true },
      { key: 'ps_ts_minus2', label: 'PS - TS-2', type: 'number' },
      { key: 'ps_ts_minus1', label: 'PS - TS-1', type: 'number' },
      { key: 'ps_ts', label: 'PS - TS', type: 'number' },
      { key: 'ps_rata', label: 'PS - Rata-rata', type: 'number', autoCalculated: true },
    ],
    applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'],
  },
  '4b': {
    sheetName: '4b', sheetTitle: 'Tabel 4.b: Peralatan Laboratorium', criteriaCode: '4',
    headerRows: 6, rowType: 'free',
    columns: [
      { key: 'no', label: 'No', type: 'number' },
      { key: 'nama_laboratorium', label: 'Nama Laboratorium', type: 'text' },
      { key: 'jumlah_lab', label: 'Jumlah Lab.', type: 'number' },
      { key: 'nama_alat', label: 'Nama Alat/Peraga', type: 'text' },
      { key: 'jumlah_alat_standar', label: 'Jumlah Alat - Standar Minimal', type: 'number' },
      { key: 'jumlah_alat_dimiliki', label: 'Jumlah Alat - Yang Dimiliki UPPS', type: 'number' },
      { key: 'kepemilikan_sendiri', label: 'Kepemilikan - Sendiri', type: 'boolean' },
      { key: 'kepemilikan_sewa', label: 'Kepemilikan - Sewa', type: 'boolean' },
      { key: 'kondisi_terawat', label: 'Kondisi - Terawat', type: 'boolean' },
      { key: 'kondisi_tidak_terawat', label: 'Kondisi - Tidak Terawat', type: 'boolean' },
      { key: 'logbook_ada', label: 'Logbook - Ada', type: 'boolean' },
      { key: 'logbook_tidak_ada', label: 'Logbook - Tidak Ada', type: 'boolean' },
      { key: 'waktu_penggunaan', label: 'Rata-rata Waktu Penggunaan (Jam/Minggu)', type: 'number' },
    ],
    applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'],
  },
  '4c': {
    sheetName: '4c', sheetTitle: 'Tabel 4.c: Prasarana', criteriaCode: '4',
    headerRows: 5, rowType: 'free',
    columns: [
      { key: 'no', label: 'No', type: 'number' },
      { key: 'nama_prasarana', label: 'Nama Prasarana', type: 'text' },
      { key: 'fungsi', label: 'Fungsi', type: 'text' },
      { key: 'jumlah_unit', label: 'Jumlah Unit', type: 'number' },
      { key: 'total_luas', label: 'Total Luas (m2)', type: 'number' },
      { key: 'kepemilikan', label: 'Milik Sendiri/Sewa', type: 'text' },
      { key: 'kondisi_terawat', label: 'Kondisi - Terawat', type: 'boolean' },
      { key: 'kondisi_tidak_terawat', label: 'Kondisi - Tidak Terawat', type: 'boolean' },
    ],
    applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'],
  },
  '5a-1': {
    sheetName: '5a-1', sheetTitle: 'Tabel 5.a.1: Kurikulum', criteriaCode: '5', subCriteriaCode: '5a',
    headerRows: 8, rowType: 'free',
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'semester', label: 'Semester', type: 'number' },
      { key: 'kode_mk', label: 'Kode Mata Kuliah', type: 'text' },
      { key: 'nama_mk', label: 'Nama Mata Kuliah', type: 'text' },
      { key: 'mk_kompetensi', label: 'Mata Kuliah Kompetensi', type: 'text' },
      { key: 'sks_kuliah', label: 'Bobot Kredit - Kuliah/Responsi/Tutorial', type: 'number' },
      { key: 'sks_seminar', label: 'Bobot Kredit - Seminar', type: 'number' },
      { key: 'sks_praktikum', label: 'Bobot Kredit - Praktikum/Praktik Lapangan', type: 'number' },
      { key: 'konversi_kredit', label: 'Konversi Kredit ke Jam (Vokasi)', type: 'number' },
      { key: 'capaian_sikap', label: 'Capaian Pembelajaran - Sikap', type: 'boolean' },
      { key: 'capaian_pengetahuan', label: 'Capaian Pembelajaran - Pengetahuan', type: 'boolean' },
      { key: 'capaian_umum', label: 'Capaian Pembelajaran - Keterampilan Umum', type: 'boolean' },
      { key: 'capaian_khusus', label: 'Capaian Pembelajaran - Keterampilan Khusus', type: 'boolean' },
      { key: 'dok_rps', label: 'Dokumen Rencana Pembelajaran', type: 'url' },
      { key: 'unit_penyelenggara', label: 'Unit Penyelenggara', type: 'select', options: ['Universitas', 'Fakultas', 'Prodi'] },
    ],
    applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'],
  },
  '5a-2': {
    sheetName: '5a-2', sheetTitle: 'Tabel 5.a.2: Bimbingan Tugas Akhir', criteriaCode: '5', subCriteriaCode: '5a',
    headerRows: 8, rowType: 'free',
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'nama_pembimbing', label: 'Nama Dosen Pembimbing', type: 'text' },
      { key: 'strata_pendidikan', label: 'Status Dosen - Strata Pendidikan', type: 'text' },
      { key: 'jabatan_akademik', label: 'Status Dosen - Jabatan Akademik', type: 'text' },
      { key: 'jml_mhs_ts_minus2', label: 'Jumlah Mahasiswa - TS-2', type: 'number' },
      { key: 'jml_mhs_ts_minus1', label: 'Jumlah Mahasiswa - TS-1', type: 'number' },
      { key: 'jml_mhs_ts', label: 'Jumlah Mahasiswa - TS', type: 'number' },
      { key: 'jml_pertemuan_ts_minus2', label: 'Jumlah Pertemuan - TS-2', type: 'number' },
      { key: 'jml_pertemuan_ts_minus1', label: 'Jumlah Pertemuan - TS-1', type: 'number' },
      { key: 'jml_pertemuan_ts', label: 'Jumlah Pertemuan - TS', type: 'number' },
      { key: 'lama_ts_minus2', label: 'Lama Penyelesaian (Bulan) - TS-2', type: 'number' },
      { key: 'lama_ts_minus1', label: 'Lama Penyelesaian (Bulan) - TS-1', type: 'number' },
      { key: 'lama_ts', label: 'Lama Penyelesaian (Bulan) - TS', type: 'number' },
    ],
    applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'],
  },
  '5a-3': {
    sheetName: '5a-3', sheetTitle: 'Tabel 5.a.3: Mata Kuliah Basic Science dan Matematika', criteriaCode: '5', subCriteriaCode: '5a',
    headerRows: 6, rowType: 'free',
    columns: [
      { key: 'no', label: 'No', type: 'number' },
      { key: 'nama_mk', label: 'Nama Mata Kuliah Basic Science dan Matematika', type: 'text' },
      { key: 'semester', label: 'Semester', type: 'number' },
      { key: 'jumlah_sks', label: 'Jumlah SKS', type: 'number' },
    ],
    applicableTo: ['S', 'STr'],
  },
  '5a-4': {
    sheetName: '5a-4', sheetTitle: 'Tabel 5.a.4: Mata Kuliah Capstone Design', criteriaCode: '5', subCriteriaCode: '5a',
    headerRows: 6, rowType: 'free',
    columns: [
      { key: 'no', label: 'No', type: 'number' },
      { key: 'nama_mk', label: 'Nama Mata Kuliah Capstone Design', type: 'text' },
      { key: 'semester', label: 'Semester', type: 'number' },
      { key: 'cakupan_bahasan', label: 'Cakupan Bahasan', type: 'textarea' },
    ],
    applicableTo: ['S', 'STr'],
  },
  '5b-1': {
    sheetName: '5b-1', sheetTitle: 'Tabel 5.b.1: Konversi Kegiatan MBKM ke MK (Rencana)', criteriaCode: '5', subCriteriaCode: '5b',
    headerRows: 6, rowType: 'free',
    columns: [
      { key: 'no', label: 'No', type: 'number' },
      { key: 'kode_mk', label: 'Kode Mata Kuliah', type: 'text' },
      { key: 'nama_mk', label: 'Nama Mata Kuliah', type: 'text' },
      { key: 'posisi_semester', label: 'Posisi Semester Kurikulum', type: 'number' },
      { key: 'beban_sks', label: 'Beban SKS', type: 'number' },
      { key: 'jenis_kegiatan_mbkm', label: 'Jenis Kegiatan MBKM yang Disetarakan', type: 'text' },
    ],
    applicableTo: ['S', 'STr'],
  },
  '5b-2': {
    sheetName: '5b-2', sheetTitle: 'Tabel 5.b.2: Konversi Kegiatan MBKM ke MK (Pelaksanaan)', criteriaCode: '5', subCriteriaCode: '5b',
    headerRows: 6, rowType: 'free',
    columns: [
      { key: 'no', label: 'No', type: 'number' },
      { key: 'kode_mk', label: 'Kode Mata Kuliah', type: 'text' },
      { key: 'nama_mk', label: 'Nama Mata Kuliah', type: 'text' },
      { key: 'posisi_semester', label: 'Posisi Semester Kurikulum', type: 'number' },
      { key: 'beban_sks', label: 'Beban SKS', type: 'number' },
      { key: 'jenis_kegiatan_mbkm', label: 'Jenis Kegiatan MBKM yang Disetarakan', type: 'text' },
    ],
    applicableTo: ['S', 'STr'],
  },
  '5b-3': {
    sheetName: '5b-3', sheetTitle: 'Tabel 5.b.3: Pelaksanaan Kegiatan MBKM', criteriaCode: '5', subCriteriaCode: '5b',
    headerRows: 6, rowType: 'free',
    columns: [
      { key: 'no', label: 'No', type: 'number' },
      { key: 'nama_kegiatan', label: 'Nama Kegiatan', type: 'text' },
      { key: 'periode_durasi', label: 'Periode Pelaksanaan & Durasi', type: 'text' },
      { key: 'jenis_kegiatan', label: 'Jenis Kegiatan MBKM', type: 'text' },
      { key: 'mk_setara', label: 'Mata Kuliah yang Setara (kode & nama)', type: 'text' },
      { key: 'sks_setara', label: 'SKS MK yang Setara', type: 'number' },
      { key: 'jumlah_mahasiswa', label: 'Jumlah Mahasiswa PS yang Mengikuti', type: 'number' },
      { key: 'lembaga_mitra', label: 'Nama Lembaga Mitra', type: 'text' },
      { key: 'dtps_pembimbing', label: 'Nama DTPS yang Menjadi Pembimbing', type: 'text' },
      { key: 'no_perjanjian', label: 'Nomor Perjanjian Kerjasama dengan Mitra', type: 'text' },
    ],
    applicableTo: ['S', 'STr'],
  },
  '5c': {
    sheetName: '5c', sheetTitle: 'Tabel 5.c: Integrasi Penelitian/PkM ke Pembelajaran', criteriaCode: '5',
    headerRows: 11, rowType: 'free',
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'nama_dosen', label: 'Nama Dosen', type: 'text' },
      { key: 'judul_penelitian_pkm', label: 'Judul Penelitian/PkM', type: 'text' },
      { key: 'mata_kuliah', label: 'Mata Kuliah', type: 'text' },
      { key: 'bentuk_integrasi', label: 'Bentuk Integrasi', type: 'text' },
      { key: 'tahun_ts_minus2', label: 'Tahun - TS-2', type: 'number' },
      { key: 'tahun_ts_minus1', label: 'Tahun - TS-1', type: 'number' },
      { key: 'tahun_ts', label: 'Tahun - TS', type: 'number' },
      { key: 'tingkat_internasional', label: 'Tingkat - Internasional', type: 'boolean' },
      { key: 'tingkat_nasional', label: 'Tingkat - Nasional', type: 'boolean' },
      { key: 'tingkat_wilayah', label: 'Tingkat - PT/Wilayah', type: 'boolean' },
      { key: 'sesuai_roadmap', label: 'Kesesuaian dengan Roadmap - Sesuai', type: 'boolean' },
      { key: 'kurang_sesuai_roadmap', label: 'Kesesuaian dengan Roadmap - Kurang Sesuai', type: 'boolean' },
      { key: 'tidak_sesuai_roadmap', label: 'Kesesuaian dengan Roadmap - Tidak Sesuai', type: 'boolean' },
    ],
    applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'],
  },
  '5d': {
    sheetName: '5d', sheetTitle: 'Tabel 5.d: Kepuasan Mahasiswa terhadap Proses Pembelajaran', criteriaCode: '5',
    headerRows: 5, rowType: 'fixed', fixedRows: ['Aspek 1', 'Aspek 2', 'Aspek 3', 'Aspek 4', 'Aspek 5', 'Aspek 6'],
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'aspek', label: 'Aspek yang Diukur', type: 'text' },
      { key: 'sangat_baik', label: 'Tingkat Kepuasan - Sangat Baik (%)', type: 'number' },
      { key: 'baik', label: 'Tingkat Kepuasan - Baik (%)', type: 'number' },
      { key: 'cukup', label: 'Tingkat Kepuasan - Cukup (%)', type: 'number' },
      { key: 'kurang', label: 'Tingkat Kepuasan - Kurang (%)', type: 'number' },
      { key: 'rencana_tindak_lanjut', label: 'Rencana Tindak Lanjut oleh UPPS/PS', type: 'textarea' },
    ],
    applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'],
  },
  '6a': { sheetName: '6a', sheetTitle: 'Tabel 6.a: Keterlibatan Mahasiswa dalam Penelitian Dosen', criteriaCode: '6', headerRows: 8, rowType: 'free', columns: [{ key: 'no', label: 'No.', type: 'number' }, { key: 'nama_dosen', label: 'Nama Dosen', type: 'text' }, { key: 'tema_penelitian', label: 'Tema Penelitian sesuai Roadmap', type: 'text' }, { key: 'nama_mahasiswa', label: 'Nama Mahasiswa', type: 'text' }, { key: 'judul_kegiatan', label: 'Judul Kegiatan', type: 'text' }, { key: 'tahun', label: 'Tahun (YYYY)', type: 'number' }], applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'] },
  '6b': { sheetName: '6b', sheetTitle: 'Tabel 6.b: Keterlibatan Mahasiswa dalam Tesis/Disertasi', criteriaCode: '6', headerRows: 4, rowType: 'free', columns: [{ key: 'no', label: 'No.', type: 'number' }, { key: 'nama_dosen', label: 'Nama Dosen', type: 'text' }, { key: 'tema_penelitian', label: 'Tema Penelitian sesuai Roadmap', type: 'text' }, { key: 'nama_mahasiswa', label: 'Nama Mahasiswa', type: 'text' }, { key: 'judul_tesis_disertasi', label: 'Judul Tesis/Disertasi', type: 'text' }, { key: 'tahun', label: 'Tahun (YYYY)', type: 'number' }], applicableTo: ['M', 'MTr', 'D', 'DTr'] },
  '7': { sheetName: '7', sheetTitle: 'Tabel 7: Keterlibatan Mahasiswa dalam PkM Dosen', criteriaCode: '6', headerRows: 4, rowType: 'free', columns: [{ key: 'no', label: 'No.', type: 'number' }, { key: 'nama_dosen', label: 'Nama Dosen', type: 'text' }, { key: 'tema_pkm', label: 'Tema PkM sesuai Roadmap', type: 'text' }, { key: 'nama_mahasiswa', label: 'Nama Mahasiswa', type: 'text' }, { key: 'judul_pkm', label: 'Judul Kegiatan PkM (selain KKN)', type: 'text' }, { key: 'tahun', label: 'Tahun (YYYY)', type: 'number' }], applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'] },
  '8a': {
    sheetName: '8a', sheetTitle: 'Tabel 8.a: IPK Lulusan', criteriaCode: '7',
    headerRows: 5, rowType: 'fixed', fixedRows: ['TS-2', 'TS-1', 'TS'],
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'tahun_lulus', label: 'Tahun Lulus', type: 'text' },
      { key: 'jumlah_lulusan', label: 'Jumlah Lulusan', type: 'number' },
      { key: 'ipk_min', label: 'IPK - Min.', type: 'number' },
      { key: 'ipk_rata', label: 'IPK - Rata-rata', type: 'number' },
      { key: 'ipk_maks', label: 'IPK - Maks', type: 'number' },
    ],
    applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'],
  },
  '8b1': { sheetName: '8b1', sheetTitle: 'Tabel 8.b.1: Prestasi Akademik Mahasiswa', criteriaCode: '7', headerRows: 7, rowType: 'free', columns: PRESTASI_COLUMNS, applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'] },
  '8b2': { sheetName: '8b2', sheetTitle: 'Tabel 8.b.2: Prestasi Non-Akademik Mahasiswa', criteriaCode: '7', headerRows: 7, rowType: 'free', columns: PRESTASI_COLUMNS, applicableTo: ['S', 'STr', 'D1', 'D2', 'D3'] },
  '8c': {
    sheetName: '8c', sheetTitle: 'Tabel 8.c: Masa Studi Lulusan', criteriaCode: '7',
    headerRows: 3, rowType: 'form',
    columns: [
      { key: 'tahun_masuk', label: 'Tahun Masuk', type: 'text' },
      { key: 'jumlah_reguler', label: 'Jumlah Mahasiswa Reguler per Angkatan', type: 'number' },
      { key: 'jumlah_lulusan', label: 'Jumlah Lulusan s.d. TS', type: 'number' },
    ],
    applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'],
  },
  '8d1': {
    sheetName: '8d1', sheetTitle: 'Tabel 8.d.1: Waktu Tunggu Lulusan', criteriaCode: '7',
    headerRows: 5, rowType: 'form',
    columns: [
      { key: 'tahun_lulus', label: 'Tahun Lulus', type: 'text' },
      { key: 'jumlah_lulusan', label: 'Jumlah Lulusan', type: 'number' },
      { key: 'jumlah_terlacak', label: 'Jumlah Lulusan yang Terlacak', type: 'number' },
      { key: 'dipesan_sebelum_lulus', label: 'Jumlah Lulusan yang Dipesan Sebelum Lulus', type: 'number' },
      { key: 'waktu_tunggu', label: 'Waktu Tunggu Mendapatkan Pekerjaan', type: 'number' },
    ],
    applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'],
  },
  '8d2': {
    sheetName: '8d2', sheetTitle: 'Tabel 8.d.2: Kesesuaian Bidang Kerja Lulusan', criteriaCode: '7',
    headerRows: 5, rowType: 'form',
    columns: [
      { key: 'tahun_lulus', label: 'Tahun Lulus', type: 'text' },
      { key: 'jumlah_lulusan', label: 'Jumlah Lulusan', type: 'number' },
      { key: 'jumlah_terlacak', label: 'Jumlah Lulusan yang Terlacak', type: 'number' },
      { key: 'kesesuaian_bidang', label: 'Kesesuaian Bidang Kerja', type: 'number' },
    ],
    applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'],
  },
  '8e1': {
    sheetName: '8e1', sheetTitle: 'Tabel 8.e.1: Tempat Kerja Lulusan', criteriaCode: '7',
    headerRows: 5, rowType: 'form',
    columns: [
      { key: 'tahun_lulus', label: 'Tahun Lulus', type: 'text' },
      { key: 'jumlah_lulusan', label: 'Jumlah Lulusan', type: 'number' },
      { key: 'pengguna_memberi_tanggapan', label: 'Jumlah Pengguna Lulusan yang Memberi Tanggapan', type: 'number' },
      { key: 'jumlah_terlacak', label: 'Jumlah Lulusan yang Terlacak', type: 'number' },
      { key: 'tempat_kerja', label: 'Jumlah Lulusan Terlacak yang Bekerja', type: 'number' },
    ],
    applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'],
  },
  '8e2': {
    sheetName: '8e2', sheetTitle: 'Tabel 8.e.2: Kepuasan Pengguna Lulusan', criteriaCode: '7',
    headerRows: 5, rowType: 'fixed',
    fixedRows: ['Etika', 'Keahlian Bidang Ilmu', 'Bahasa Asing', 'Teknologi Informasi', 'Komunikasi', 'Kerjasama Tim', 'Pengembangan Diri'],
    columns: [
      { key: 'no', label: 'No', type: 'number' },
      { key: 'jenis_kemampuan', label: 'Jenis Kemampuan', type: 'text' },
      { key: 'sangat_baik', label: 'Tingkat Kepuasan - Sangat Baik (%)', type: 'number' },
      { key: 'baik', label: 'Tingkat Kepuasan - Baik (%)', type: 'number' },
      { key: 'cukup', label: 'Tingkat Kepuasan - Cukup (%)', type: 'number' },
      { key: 'kurang', label: 'Tingkat Kepuasan - Kurang (%)', type: 'number' },
      { key: 'rencana_tindak_lanjut', label: 'Rencana Tindak Lanjut oleh UPPS/PS', type: 'textarea' },
    ],
    applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'],
  },
  '8f1': { sheetName: '8f1', sheetTitle: 'Tabel 8.f.1: Publikasi Mahasiswa (Jurnal)', criteriaCode: '7', headerRows: 5, rowType: 'fixed', fixedRows: ['Jurnal Nasional', 'Jurnal Nasional Terakreditasi', 'Jurnal Internasional', 'Jurnal Internasional Bereputasi', 'Prosiding Nasional', 'Prosiding Internasional', 'Prosiding Internasional Terindeks'], columns: PUBLIKASI_COLUMNS, applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'] },
  '8f2': { sheetName: '8f2', sheetTitle: 'Tabel 8.f.2: Publikasi Mahasiswa (Prosiding/Buku)', criteriaCode: '7', headerRows: 5, rowType: 'fixed', fixedRows: ['Prosiding Nasional', 'Prosiding Internasional', 'Prosiding Terindeks', 'Buku', 'Modul', 'Lainnya'], columns: PUBLIKASI_COLUMNS, applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'] },
  '8f3': { sheetName: '8f3', sheetTitle: 'Tabel 8.f.3: Sitasi Karya Ilmiah Mahasiswa', criteriaCode: '7', headerRows: 4, rowType: 'free', columns: [{ key: 'no', label: 'No.', type: 'number' }, { key: 'nama_mahasiswa', label: 'Nama Mahasiswa', type: 'text' }, { key: 'judul_artikel', label: 'Judul Artikel yang Disitasi', type: 'textarea' }, { key: 'jumlah_sitasi', label: 'Jumlah Sitasi', type: 'number' }], applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'] },
  '8f4': { sheetName: '8f4', sheetTitle: 'Tabel 8.f.4: Produk/Jasa Mahasiswa', criteriaCode: '7', headerRows: 4, rowType: 'free', columns: [{ key: 'no', label: 'No.', type: 'number' }, { key: 'nama_mahasiswa', label: 'Nama Mahasiswa', type: 'text' }, { key: 'nama_produk_jasa', label: 'Nama Produk/Jasa', type: 'text' }, { key: 'deskripsi', label: 'Deskripsi Produk/Jasa', type: 'textarea' }, { key: 'bukti', label: 'Bukti', type: 'url' }], applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'] },
  '8f5-1': { sheetName: '8f5-1', sheetTitle: 'Luaran Mahasiswa: Paten', criteriaCode: '7', headerRows: 5, rowType: 'free', columns: [...HKIPATEN_COLUMNS.slice(0,3), { key: 'status', label: 'Status (Registered/Granted/Komersial)', type: 'text' }, { key: 'nomor_registrasi', label: 'Nomor Registrasi/Paten', type: 'text' }], applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'] },
  '8f5-2': { sheetName: '8f5-2', sheetTitle: 'Luaran Mahasiswa: HKI', criteriaCode: '7', headerRows: 5, rowType: 'free', columns: [...HKIHAKCIP_COLUMNS.slice(0,3), { key: 'nomor_hki', label: 'Nomor HKI', type: 'text' }], applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'] },
  '8f5-3': { sheetName: '8f5-3', sheetTitle: 'Luaran Mahasiswa: Teknologi (TKT)', criteriaCode: '7', headerRows: 5, rowType: 'free', columns: HKITKT_COLUMNS, applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'] },
  '8f5-4': { sheetName: '8f5-4', sheetTitle: 'Luaran Mahasiswa: Buku', criteriaCode: '7', headerRows: 5, rowType: 'free', columns: HKIBUKU_COLUMNS, applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'] },
  '9a': {
    sheetName: '9a', sheetTitle: 'Tabel 9.a: Monitoring dan Evaluasi Penjaminan Mutu', criteriaCode: '8',
    headerRows: 5, rowType: 'fixed',
    fixedRows: ['Standar 1', 'Standar 2', 'Standar 3', 'Standar 4', 'Standar 5', 'Standar 6', 'Standar 7', 'Standar 8'],
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'nama_standar', label: 'Nama Standar (SN Dikti)', type: 'text' },
      { key: 'ketersediaan_standar', label: 'Ketersediaan Standar (P)', type: 'text' },
      { key: 'pelaksanaan_standar', label: 'Pelaksanaan Standar (P)', type: 'text' },
      { key: 'monev_audit', label: 'Monitoring, Evaluasi dan Audit Mutu Internal (E)', type: 'text' },
      { key: 'umpan_balik', label: 'Umpan Balik Audit Mutu Internal (P)', type: 'text' },
      { key: 'tindak_lanjut', label: 'Tindak Lanjut Audit Mutu Internal (P)', type: 'text' },
      { key: 'tanggal_audit', label: 'Tanggal Audit Mutu Internal (HH/BB/TTTT)', type: 'date' },
    ],
    applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'],
  },
  '9b': {
    sheetName: '9b', sheetTitle: 'Tabel 9.b: Dokumen Penjaminan Mutu', criteriaCode: '8',
    headerRows: 3, rowType: 'fixed', fixedRows: ['Kebijakan SPMI', 'Pedoman PPEPP', 'Standar Mutu', 'Tata Cara Dokumentasi'],
    columns: [
      { key: 'no', label: 'No.', type: 'number' },
      { key: 'jenis_dokumen', label: 'Jenis Dokumen Penjaminan Mutu', type: 'text' },
      { key: 'no_dokumen', label: 'No Dokumen', type: 'text' },
      { key: 'tanggal_dokumen', label: 'Tanggal Dokumen', type: 'date' },
    ],
    applicableTo: ['S', 'STr', 'M', 'MTr', 'D', 'DTr', 'D1', 'D2', 'D3'],
  },
};

// ============================================================
// ORDERED SHEET NAME LISTS (for UI)
// ============================================================
export const LKPS_SHEET_NAMES_INFOKOM = Object.keys(LKPS_SHEETS_INFOKOM);
export const LKPS_SHEET_NAMES_LAMTEKNIK = Object.keys(LKPS_SHEETS_LAMTEKNIK);

// ============================================================
// UNIFIED LKPS_SHEETS (for backward compatibility with old references)
// Maps to INFOKOM by default - use format-specific ones where possible
// ============================================================
export const LKPS_SHEETS = LKPS_SHEETS_INFOKOM;

// ============================================================
// KRITERIA
// ============================================================
export const LKPS_KRITERIA = {
  '1': { name: 'Visi Misi Tujuan Strategi', subKriteria: [] },
  '2': { name: 'Tata Pamong, Tata Kelola, dan Kerjasama', subKriteria: ['2a', '2b'] },
  '3': { name: 'Relevansi Pendidikan dan Penelitian/PkM', subKriteria: ['3a', '3b', '3c'] },
  '4': { name: 'Sumber Daya Manusia', subKriteria: [] },
  '5': { name: 'Sarana dan Prasarana', subKriteria: [] },
  '6': { name: 'Mahasiswa dan Luaran Mahasiswa', subKriteria: [] },
  '7': { name: 'Sistem Penjaminan Mutu', subKriteria: [] },
  '8': { name: 'Luaran Tridharma', subKriteria: [] },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================
/**
 * Determine LKPS format from prodi fullname (name-based detection).
 * INFOKOM: S1 Informatika, S1 Sistem Teknologi Informasi
 * TEKNIK: all other engineering prodi
 */
export function getFormatFromProdiName(prodiName: string): LKPSFormat {
  const name = prodiName.toLowerCase().replace(/[^a-z0-9]/g, ' ');
  const infokomKeywords = [
    'informatika',
    'sistem teknologi informasi',
    's1 sti',
    'sarjana informatika',
    'teknik informatika',
  ];
  for (const kw of infokomKeywords) {
    if (name.includes(kw)) return 'INFOKOM';
  }
  return 'TEKNIK';
}

export function getSheetsByFormat(format: LKPSFormat): Record<string, LKPSSheetConfig> {
  return format === 'INFOKOM' ? LKPS_SHEETS_INFOKOM : LKPS_SHEETS_LAMTEKNIK;
}

export function getSheetNamesByFormat(format: LKPSFormat): string[] {
  return format === 'INFOKOM' ? LKPS_SHEET_NAMES_INFOKOM : LKPS_SHEET_NAMES_LAMTEKNIK;
}

export function getSheetConfig(sheetName: string, format?: LKPSFormat): LKPSSheetConfig | undefined {
  const allSheets = {
    ...LKPS_SHEETS_INFOKOM,
    ...LKPS_SHEETS_LAMTEKNIK
  };
  return allSheets[sheetName];
}

export function getSheetsByKriteria(criteriaCode: string, format?: LKPSFormat): LKPSSheetConfig[] {
  const sheets = getSheetsByFormat(format || 'INFOKOM');
  return Object.values(sheets).filter(sheet => sheet.criteriaCode === criteriaCode);
}

export function getAllSheetNames(format?: LKPSFormat): string[] {
  return getSheetNamesByFormat(format || 'INFOKOM');
}

export function countSheets(format?: LKPSFormat): number {
  return getAllSheetNames(format).length;
}