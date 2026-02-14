'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Copy, Check, ShieldCheck, Lock, Globe } from 'lucide-react';
import Cookies from 'js-cookie';

export default function DashboardPage() {
  const [copied, setCopied] = useState(false);
  const token = Cookies.get('bearer_token') ?? '';

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="px-6 py-10 md:px-10">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Welcome back
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          You are signed in and authenticated.
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
            <CardDescription>Connection</CardDescription>
            <CardTitle className="font-display text-xl">Encrypted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="size-4 text-blue-500" />
              TLS 1.3
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Session</CardDescription>
            <CardTitle className="font-display text-xl">Browser</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="size-4 text-orange-500" />
              Session Cookie
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-display">Authentication Token</CardTitle>
              <CardDescription>Bearer token for API requests</CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={handleCopyToken}>
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border bg-muted/50 p-4">
            <code className="break-all font-mono text-xs text-muted-foreground">
              {token}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
