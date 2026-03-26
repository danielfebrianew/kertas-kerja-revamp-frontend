// types/PohonOpd.ts

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

// === OPD Node Types ===

export interface PohonOpdPerangkatDaerah {
  kode_opd: string;
  nama_opd: string;
}

export interface PohonOpdPelaksana {
  id_pelaksana: string;
  pegawai_id: string;
  nip: string;
  nama_pegawai: string;
}

export interface PohonOpdNode extends PohonKinerja {
  status: string;
  keterangan_crosscutting: string | null;
  id_tematik?: number | null;
  nama_tematik?: string | null;
  perangkat_daerah: PohonOpdPerangkatDaerah;
  pelaksana: PohonOpdPelaksana[] | null;
  childs?: PohonOpdNode[];
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
    childs: PohonOpdNode[];
  };
}
