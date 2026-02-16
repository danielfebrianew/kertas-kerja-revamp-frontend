'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ShieldCheck, User, BadgeCheck, Building2 } from 'lucide-react';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import type { JwtPayload } from '@/lib/jwt';

export default function DashboardPage() {
  const [user, setUser] = useState<JwtPayload | null>(null);

  useEffect(() => {
    try {
      const raw = getCookie('user');
      if (raw) setUser(JSON.parse(raw.toString()));
    } catch { /* ignore */ }
  }, []);

  return (
    <div className="px-6 py-10 md:px-10">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Selamat datang, {user?.nama_pegawai ?? '...'}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {user?.email}
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Status</CardDescription>
            <CardTitle className="font-display text-xl">Authenticated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="size-4 text-green-500" />
              Active
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Role</CardDescription>
            <CardTitle className="font-display text-xl capitalize">
              {user?.roles[0]?.replace('_', ' ') ?? '-'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BadgeCheck className="size-4 text-blue-500" />
              NIP: {user?.nip ?? '-'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>OPD</CardDescription>
            <CardTitle className="font-display text-xl">
              {user?.nama_opd || 'Tidak ada OPD'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="size-4 text-orange-500" />
              {user?.kode_opd || '-'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <User className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-display">{user?.nama_pegawai ?? '-'}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">NIP</dt>
              <dd className="font-medium">{user?.nip ?? '-'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Pegawai ID</dt>
              <dd className="font-medium">{user?.pegawai_id ?? '-'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Role</dt>
              <dd className="font-medium capitalize">{user?.roles.join(', ').replace(/_/g, ' ') ?? '-'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">User ID</dt>
              <dd className="font-medium">{user?.user_id ?? '-'}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
