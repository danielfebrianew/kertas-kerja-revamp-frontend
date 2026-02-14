'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  TreePine,
  Palette,
  Building2,
  LogOut,
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
      { title: 'Tematik', href: '/pemda/tematik', icon: Palette },
      { title: 'Pohon Kinerja', href: '/pemda/pohon', icon: TreePine },
    ],
  },
  {
    label: 'OPD',
    items: [
      { title: 'Pohon', href: '/opd/pohon', icon: Building2 },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const handleLogout = () => {
    Cookies.remove('bearer_token');
    router.push('/');
  };

  return (
    <Sidebar collapsible="icon">
      
      {/* HEADER dengan Tombol Toggle */}
      <SidebarHeader>
        {/* Tambahkan justify-between agar text di kiri dan tombol di kanan. 
            Saat menjadi icon, kita ubah jadi justify-center */}
        <div className="flex h-10 w-full items-center justify-between px-2 group-data-[collapsible=icon]:justify-center">
          
          {/* Tambahkan class group-data-[collapsible=icon]:hidden agar tulisan 
              "Kertas Kerja" menghilang saat sidebar mengecil */}
          <Link 
            href="/dashboard" 
            className="font-display text-lg font-semibold tracking-tight truncate group-data-[collapsible=icon]:hidden"
          >
            Kertas Kerja
          </Link>
          
          {/* Ini adalah tombol bawaan Shadcn untuk buka-tutup sidebar */}
          <SidebarTrigger />
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