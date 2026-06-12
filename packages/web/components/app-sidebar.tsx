"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  AudioLinesIcon,
  Code2Icon,
  GalleryVerticalEndIcon,
  LayoutDashboardIcon,
  TerminalIcon,
} from "lucide-react"

/**
 * Static sidebar seed data used until the dashboard has authenticated tenants.
 */
const data = {
  user: {
    name: "CINP",
    email: "recruiting@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "CINP",
      logo: (
        <GalleryVerticalEndIcon
        />
      ),
      plan: "MVP",
    },
    {
      name: "Recruiting",
      logo: (
        <AudioLinesIcon
        />
      ),
      plan: "Equipe",
    },
    {
      name: "Sandbox",
      logo: (
        <TerminalIcon
        />
      ),
      plan: "Local",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <LayoutDashboardIcon
        />
      ),
    },
    {
      title: "Problemes",
      url: "/problems",
      icon: (
        <Code2Icon
        />
      ),
      items: [
        {
          title: "Tous les problemes",
          url: "/problems",
        },
        {
          title: "Nouveau probleme",
          url: "/problems/new",
        },
      ],
    },
  ],
}

/**
 * Application sidebar with tenant switcher, primary nav, and user menu.
 */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
