'use client';

import {
  ArrowUpCircleIcon,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  FileQuestion,
  HelpCircleIcon,
  History,
  Library,
  SearchIcon,
  SettingsIcon,
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
  emploi: [
    {
      title: 'Planification',
      url: '#',
      icon: Calendar,
      disabled: true,
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavMain items={data.emploi} title="EMPLOI DU TEMPS" />
        <NavMain items={data.conference} title="CONFÉRENCE" />
        <NavMain items={data.bibliotheque} title="BIBLIOTHÈQUE" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
