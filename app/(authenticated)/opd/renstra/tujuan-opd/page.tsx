import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import TujuanOpdClient from './_components/TujuanOpdClient';

export default function TujuanOpdPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center px-6 py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <TujuanOpdClient />
    </Suspense>
  );
}
