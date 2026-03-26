// types/master-lembaga.ts

export interface MasterLembagaItem {
  id?: number;
  id_lembaga: string;
  nama_lembaga: string;
  kode_lembaga: string;
}

export interface MasterLembagaResponse {
  data?: {
    data?: MasterLembagaItem[];
  };
}
