export interface Lembaga {
  id: string;
  kode_lembaga: string;
  nama_lembaga: string;
  is_active: boolean;
}

export interface OPD {
  id: string;
  kode_opd: string;
  nama_opd: string;
  singkatan: string;
  alamat: string;
  telepon: string;
  fax: string;
  email: string;
  website: string;
  nama_kepala_opd: string;
  nip_kepala_opd: string;
  pangkat_kepala: string;
  id_lembaga: Lembaga;
}

export interface OPDResponse {
  code: number;
  status: string;
  data: OPD[];
}