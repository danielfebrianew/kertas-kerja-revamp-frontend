'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Building,
  Building2,
  User,
  LogOut,
  DatabaseIcon,
  TreePine,
  TreeDeciduous,
  ChevronRight,
} from 'lucide-react';
import { getCookie, deleteCookie } from 'cookies-next';

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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import type { LucideIcon } from 'lucide-react';

type NavItem = {
  title: string;
  icon: LucideIcon;
} & (
  | { href: string; children?: never }
  | { href?: never; children: { title: string; href: string; icon: LucideIcon }[] }
);

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Data Master',
    items: [
      {
        title: 'Data Master',
        icon: DatabaseIcon,
        children: [
          { title: 'Master Lembaga', href: '/data-master/master-lembaga', icon: Building },
          { title: 'Master OPD', href: '/data-master/master-opd', icon: Building2 },
          { title: 'Master Role', href: '/data-master/master-role', icon: User },
        ],
      },
    ],
  },
  {
    label: 'Pemda',
    items: [
      {
        title: 'Pemda',
        icon: Building,
        children: [
          { title: 'Tematik', href: '/pemda/tematik', icon: DatabaseIcon },
          { title: 'Pohon Kinerja Pemda', href: '/pemda/pohon', icon: TreePine },
        ],
      },
    ],
  },
  {
    label: 'OPD',
    items: [
      {
        title: 'OPD',
        icon: Building2,
        children: [
          { title: 'Pohon Kinerja OPD', href: '/opd/pohon', icon: TreeDeciduous },
          { title: 'Pohon Cascading', href: '/opd/pohon-cascading', icon: TreePine },
        ],
      },
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
      const raw = getCookie('user');
      if (raw) {
        const rawStr = typeof raw === 'string' ? raw : String(raw);
        setUser(JSON.parse(rawStr));
      }
    } catch {
      /* ignore */
    }
  }, []);

  const handleLogout = async () => {
    deleteCookie('bearer_token');
    deleteCookie('user');
    await signOut({ redirect: false });
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

                  if (item.children) {

                    const isGroupActive = item.children.some(
                      (child) => pathname === child.href
                    );

                    return (
                      <Collapsible
                        key={item.title}
                        defaultOpen={isGroupActive}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>

                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton>
                              <item.icon />
                              <span>{item.title}</span>
                              <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>

                          <CollapsibleContent>

                            <SidebarMenuSub className="ml-4 border-none gap-0 space-y-0 pl-0 py-0">

                              {item.children.map((child, index) => {

                                const isLast = index === item.children.length - 1;

                                return (
                                  <SidebarMenuSubItem
                                    key={child.href}
                                    className="relative flex items-center py-1"
                                  >

                                    {/* vertical line */}
                                    <div
                                      className={`absolute left-0 w-px border-l border-sidebar-border/50 ${
                                        isLast ? 'top-0 h-1/2' : 'top-0 h-full'
                                      }`}
                                    />

                                    {/* horizontal line */}
                                    <div className="absolute left-0 top-1/2 h-px w-4 border-t border-sidebar-border/50" />

                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={pathname === child.href}
                                      className="ml-4"
                                    >
                                      <Link href={child.href}>
                                        <child.icon className="size-4" />
                                        <span>{child.title}</span>
                                      </Link>
                                    </SidebarMenuSubButton>

                                  </SidebarMenuSubItem>
                                );
                              })}

                            </SidebarMenuSub>

                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }

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
            <SidebarMenuButton
              asChild
              onClick={handleLogout}
              className="text-background cursor-pointer"
            >
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