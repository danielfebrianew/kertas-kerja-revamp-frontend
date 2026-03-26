// app/(authenticated)/layout.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { ConfirmDialogProvider } from '@/components/ui/confirm-dialog';
import { getCookie } from 'cookies-next';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = getCookie('bearer_token');
    if (!token) {
      router.push('/');
      return;
    }
    setAuthenticated(true);
  }, [router]);

  if (!authenticated) {
    return null;
  }

  return (
    <ConfirmDialogProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex flex-1 flex-col overflow-y-auto w-full">
          <div className="p-4 md:hidden border-b border-border">
            <SidebarTrigger />
          </div>
          {children}
        </main>
        <Toaster position="top-center" />
      </SidebarProvider>
    </ConfirmDialogProvider>
  );
}
