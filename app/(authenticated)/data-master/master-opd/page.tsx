// app/(authenticated)/data-master/master-opd/page.tsx

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import MasterOpdClient from './_components/MasterOpdClient';

export default function MasterOpdPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center px-6 py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <MasterOpdClient />
    </Suspense>
  );
}
