// types/tematik.ts

import type { PohonIndikator } from './PohonPemda';

export interface TematikPemdaItem {
  id: number;
  parent: number | null;
  tema: string;
  jenis_pohon: string;
  level_pohon: number;
  keterangan: string;
  jumlah_review: number;
  is_active: boolean;
  tagging: string | null;
  indikator: PohonIndikator[] | null;
}

export interface TematikPemdaData {
  tahun: string;
  tematiks: TematikPemdaItem[];
}

export interface TematikPemdaResponse {
  code: number;
  status: string;
  data: TematikPemdaData;
}
