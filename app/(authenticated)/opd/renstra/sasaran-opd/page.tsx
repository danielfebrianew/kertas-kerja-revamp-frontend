import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import SasaranOpdClient from './_components/SasaranOpdClient';

export default function SasaranOpdPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center px-6 py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <SasaranOpdClient />
    </Suspense>
  );
}
