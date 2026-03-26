// app/(authenticated)/opd/pohon-kinerja-opd/page.tsx

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import PohonOpdClient from './_components/PohonOpdClient';

export default function OpdPohonPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center px-6 py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <PohonOpdClient />
    </Suspense>
  );
}
