import type { PohonKinerja } from './PohonPemda';

// === OPD Tujuan Types ===

export interface TujuanOpdTarget {
  tahun: string;
  target: string;
  satuan: string;
}

export interface TujuanOpdIndikator {
  indikator: string;
  targets: TujuanOpdTarget[];
}

export interface TujuanOpd {
  id: number;
  kode_opd: string;
  tujuan: string;
  indikator: TujuanOpdIndikator[];
}

// === OPD Pohon Response ===

export interface PohonOpdResponse {
  code: number;
  status: string;
  data: {
    kode_opd: string;
    nama_opd: string;
    tahun: string;
    tujuan_opd: TujuanOpd[];
    childs: PohonKinerja[];
  };
}
