import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import IkuOpdClient from './_components/IkuOpdClient';

export default function IkuOpdPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center px-6 py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <IkuOpdClient />
    </Suspense>
  );
}
