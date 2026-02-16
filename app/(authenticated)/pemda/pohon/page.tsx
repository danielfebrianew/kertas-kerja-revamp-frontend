import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import PohonPemdaClient from './_components/PohonPemdaClient';

export default function PemdaPohonPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center px-6 py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <PohonPemdaClient />
    </Suspense>
  );
}
