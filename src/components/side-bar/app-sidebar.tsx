'use client';

import {
  ArrowUpCircleIcon,
  BarChart3,
  CheckCircle,
  Clock,
  FileQuestion,
  HelpCircleIcon,
  History,
  Library,
  SearchIcon,
  SettingsIcon,
  Share2,
  Star,
  Users,
  Video,
} from 'lucide-react';
import * as React from 'react';

import { NavMain } from '@/components/side-bar/nav-main';
import { NavSecondary } from '@/components/side-bar/nav-secondary';
import { NavUser } from '@/components/side-bar/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { IUser } from '@/types/user.interface';

const data = {
  Ceo: [
    {
      title: 'Dashboard Exécutif',
      url: '/dashboard',
      icon: BarChart3,
      disabled: true,
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '/',
      icon: SettingsIcon,
      disabled: true,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: HelpCircleIcon,
      disabled: true,
    },
    {
      title: 'Search',
      url: '#',
      icon: SearchIcon,
      disabled: true,
    },
  ],
  classes: [
    {
      title: 'Toutes les classes',
      url: '/dashboard/classes',
      icon: Users,
    },
  ],
  sharedSubject: [
    {
      title: 'Cours partager',
      url: '/dashboard/classes/cours-partager/cours', // this will be use the same of the cours page
      icon: Share2,
    },
  ],
  conference: [
    {
      title: 'Réunions',
      url: '/dashboard/conferance',
      icon: Video,
    },
  ],
  bibliotheque: [
    {
      title: 'Tous les cours',
      url: '#',
      icon: Library,
      disabled: true,
    },
    {
      title: 'Mes quiz',
      url: '#',
      icon: FileQuestion,
      disabled: true,
    },
    {
      title: 'Cours en cours',
      url: '#',
      icon: Clock,
      disabled: true,
    },
    {
      title: 'Cours terminés',
      url: '#',
      icon: CheckCircle,
      disabled: true,
    },
    {
      title: 'Favoris',
      url: '#',
      icon: Star,
      disabled: true,
    },
    {
      title: 'Historique',
      url: '#',
      icon: History,
      disabled: true,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: IUser | null;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.Ceo} title="CEO" />
        <NavMain items={data.classes} title="CLASSES" />
        <NavMain items={data.sharedSubject} title="COURS PARTAGER" />
        {user?.role === 'student' ? null : (
          <NavMain items={data.conference} title="CONFERENCES" />
        )}
        <NavMain items={data.bibliotheque} title="BIBLIOTHÈQUE" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
