'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  TreePine,
  Palette,
  Building2,
  LogOut,
  TreePalmIcon,
  DatabaseIcon,
} from 'lucide-react';
import Cookies from 'js-cookie';

// 1. Tambahkan SidebarTrigger ke dalam import
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Pemda',
    items: [
      { title: 'Tematik', href: '/pemda/tematik', icon: DatabaseIcon },
      { title: 'Pohon Kinerja Pemda', href: '/pemda/pohon', icon: TreePine },
    ],
  },
  {
    label: 'OPD',
    items: [
      { title: 'Pohon Kinerja OPD', href: '/opd/pohon', icon: TreePalmIcon },
    ],
  },
];

interface UserCookie {
  nama_pegawai: string;
  nip: string;
  roles: string[];
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserCookie | null>(null);

  useEffect(() => {
    try {
      const raw = Cookies.get('user');
      if (raw) setUser(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const handleLogout = () => {
    Cookies.remove('bearer_token');
    Cookies.remove('user');
    router.push('/');
  };

  return (
    <Sidebar collapsible="icon">
      
      {/* HEADER */}
      <SidebarHeader>
        <div className="relative flex w-full items-center justify-end px-2 group-data-[collapsible=icon]:justify-center">
          <SidebarTrigger />
        </div>
        <div className="flex flex-col items-center gap-2 pb-4 group-data-[collapsible=icon]:hidden">
          <Image
            src="/icon.png"
            alt="Kertas Kerja"
            width={64}
            height={64}
          />
          <div className="text-center">
            <p className="font-display text-sm font-bold uppercase tracking-wider text-sidebar-foreground">
              Kertas Kerja
            </p>
            {user && (
              <p className="text-xs text-sidebar-foreground/60 mt-0.5">
                {user.roles[0]?.replace('_', ' ')}
              </p>
            )}
          </div>
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild onClick={handleLogout} className="text-background cursor-pointer">
              <div>
                <LogOut />
                <span>Logout</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}