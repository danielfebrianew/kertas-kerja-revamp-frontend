export interface Periode {
  id: number;
  tahun_awal: string;
  tahun_akhir: string;
  jenis_periode: string;
  tahun_list: string[];
}

export interface SasaranOpdRow {
  id: string;
  id_sasaran_opd: string;
  nama_pohon: string;
  jenis_pohon: string;
  pelaksana: string[];
  sasaran: string;
  nama_tujuan_opd: string;
  indikator: string;
  rumus_perhitungan: string;
  sumber_data: string;
  [key: string]: unknown;
}

export interface SasaranOpdTableProps {
  rows: SasaranOpdRow[];
  tahunList: string[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}
