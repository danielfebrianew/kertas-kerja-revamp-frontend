import { fetchApi } from '@/lib/fetcher';
import { Periode, SasaranOpdRow } from './types';

export async function getPeriodeList(): Promise<Periode[]> {
  const res = await fetchApi<{ data: Periode[] }>({ type: 'auth', method: 'GET', url: '/periode/findall' });
  return res.data?.data ?? [];
}

export async function getSasaranOpd(
  kodeOpd: string,
  tahun_awal: string,
  tahun_akhir: string,
  jenis_periode: string
): Promise<{ rows: SasaranOpdRow[]; tahunList: string[] }> {
  const res = await fetchApi({
    type: 'auth',
    method: 'GET',
    url: `/sasaran_opd/findall/${kodeOpd}/${tahun_awal}/${tahun_akhir}/${jenis_periode}`,
  });
  return flattenRows(res.data?.data ?? []);
}

function flattenRows(apiData: any[]): { rows: SasaranOpdRow[]; tahunList: string[] } {
  const tahunSet = new Set<string>();
  const rows: SasaranOpdRow[] = [];

  for (const item of apiData) {
    const { nama_pohon, jenis_pohon, sasaran_opd, pelaksana } = item;
    const pelaksanaList: string[] = (pelaksana ?? []).map((p: any) => p.nama_pegawai);

    for (const sasaran of sasaran_opd ?? []) {
      for (const ind of sasaran.indikator ?? []) {
        const row: SasaranOpdRow = {
          id: `${sasaran.id}-${ind.id}`,
          id_sasaran_opd: sasaran.id,
          nama_pohon,
          jenis_pohon,
          pelaksana: pelaksanaList,
          sasaran: sasaran.nama_sasaran_opd,
          nama_tujuan_opd: sasaran.nama_tujuan_opd,
          indikator: ind.indikator,
          rumus_perhitungan: ind.rumus_perhitungan,
          sumber_data: ind.sumber_data,
        };

        for (const t of ind.target ?? []) {
          tahunSet.add(t.tahun);
          row[`target_${t.tahun}`] = t.target;
          row[`satuan_${t.tahun}`] = t.satuan;
        }

        rows.push(row);
      }

      if (!sasaran.indikator || sasaran.indikator.length === 0) {
        rows.push({
          id: `${sasaran.id}-no-ind`,
          id_sasaran_opd: sasaran.id,
          nama_pohon,
          jenis_pohon,
          pelaksana: pelaksanaList,
          sasaran: sasaran.nama_sasaran_opd,
          nama_tujuan_opd: sasaran.nama_tujuan_opd,
          indikator: '',
          rumus_perhitungan: '',
          sumber_data: '',
        });
      }
    }
  }

  const tahunList = Array.from(tahunSet).sort();
  return { rows, tahunList };
}
