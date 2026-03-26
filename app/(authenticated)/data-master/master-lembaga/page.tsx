// app/(authenticated)/data-master/master-lembaga/page.tsx

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import MasterLembagaClient from './_components/MasterLembagaClient';

export default function MasterLembagaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center px-6 py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <MasterLembagaClient />
    </Suspense>
  );
}
