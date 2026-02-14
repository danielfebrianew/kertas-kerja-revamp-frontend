// === Pohon Kinerja API Types ===

export interface PohonTarget {
  id_target: string;
  indikator_id: string;
  target: string;
  satuan: string;
}

export interface PohonIndikator {
  id_indikator: string;
  id_pokin: string;
  nama_indikator: string;
  targets: PohonTarget[];
}

export interface PohonKinerja {
  id: number;
  parent: number | null;
  nama_pohon: string;
  jenis_pohon: string;
  level_pohon: number;
  keterangan: string;
  jumlah_review: number;
  is_active: boolean;
  tagging: string | null;
  indikator: PohonIndikator[];
  childs?: PohonKinerja[];
}

export interface PohonPemdaResponse {
  code: number;
  status: string;
  data: PohonKinerja;
}

// === Tematik List API Types ===

export interface TematikItem {
  id: number;
  nama_pohon: string;
  tahun: string;
  jenis_pohon: string;
  level_pohon: number;
  status: string;
  is_active: boolean;
}

export interface TematikResponse {
  code: number;
  status: string;
  data: TematikItem[];
}