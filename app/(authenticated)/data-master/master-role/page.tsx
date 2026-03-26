// app/(authenticated)/data-master/master-role/page.tsx

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import MasterRoleClient from './_components/MasterRoleClient';

export default function MasterRolePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center px-6 py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <MasterRoleClient />
    </Suspense>
  );
}
