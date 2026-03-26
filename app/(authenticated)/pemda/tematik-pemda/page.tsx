// app/(authenticated)/pemda/tematik-pemda/page.tsx

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import TematikClient from './_components/TematikClient';

export default function PemdaTematikPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center px-6 py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <TematikClient />
    </Suspense>
  );
}
