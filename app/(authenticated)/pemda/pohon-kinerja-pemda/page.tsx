// app/(authenticated)/pemda/pohon-kinerja-pemda/page.tsx

import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { Loader2 } from 'lucide-react';
import { fetchApi } from '@/lib/fetcher';
import type { TematikResponse, PohonPemdaResponse, PohonKinerja } from '@/types/PohonPemda';
import PohonPemdaClient from './_components/PohonPemdaClient';

function parseTahunCookie(raw: string | undefined): string {
  if (!raw) return String(new Date().getFullYear());
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' ? parsed.value || '' : String(parsed);
  } catch {
    if (/^\d{4}$/.test(raw)) return raw;
  }
  return String(new Date().getFullYear());
}

function mapPohonResponse(node: Record<string, unknown>): PohonKinerja {
  const { tema, childs, ...rest } = node;
  return {
    ...rest,
    nama_pohon: (node.nama_pohon as string) ?? (tema as string) ?? '',
    childs: Array.isArray(childs)
      ? (childs as Record<string, unknown>[]).map(mapPohonResponse)
      : undefined,
  } as PohonKinerja;
}

async function PohonPemdaLoader({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const tahun = parseTahunCookie(cookieStore.get('tahun')?.value);
  const selectedId = params.id ?? '';

  let tematikList: TematikResponse['data'] = [];
  let pohonData: PohonKinerja[] = [];

  if (tahun) {
    try {
      const resTematik = await fetchApi<TematikResponse>({ type: 'auth',  method: 'GET', 
        url: `/pohon_kinerja/tematik/${tahun}`,
      });
      tematikList = resTematik.data?.data ?? [];
    } catch {
      tematikList = [];
    }
  }

  if (selectedId) {
    try {
      const resPohon = await fetchApi<PohonPemdaResponse>({ type: 'auth',  method: 'GET', 
        url: `/pohon_kinerja_admin/tematik/${selectedId}`,
      });
      const node = resPohon.data?.data;
      pohonData = node
        ? [mapPohonResponse(node as unknown as Record<string, unknown>)]
        : [];
    } catch {
      pohonData = [];
    }
  }

  return (
    <PohonPemdaClient
      initialTematik={tematikList}
      initialPohon={pohonData}
      tahun={tahun}
      selectedId={selectedId}
    />
  );
}

export default function PemdaPohonPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center px-6 py-5">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <PohonPemdaLoader searchParams={searchParams} />
    </Suspense>
  );
}
