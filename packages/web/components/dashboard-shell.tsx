"use client"

import { usePathname } from "next/navigation"

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

/**
 * Static route title map used by the dashboard breadcrumb.
 */
const pageTitles: Record<string, string> = {
  "/dashboard": "Vue d'ensemble",
  "/problems": "Problemes",
  "/problems/new": "Nouveau probleme",
  "/assessments": "Evaluations",
  "/assessments/new": "Nouvelle evaluation",
}

/**
 * Resolves dynamic dashboard paths to a breadcrumb title.
 *
 * @param pathname The current dashboard pathname.
 * @returns The localized breadcrumb title for that route.
 */
function getCurrentTitle(pathname: string) {
  if (pathname.startsWith("/problems/") && pathname.endsWith("/edit")) {
    return "Modifier le probleme"
  }

  if (pathname.startsWith("/problems/")) {
    return "Detail du probleme"
  }

  if (pathname.startsWith("/assessments/") && pathname.endsWith("/edit")) {
    return "Modifier l'evaluation"
  }

  if (pathname.startsWith("/assessments/")) {
    return "Detail de l'evaluation"
  }

  return pageTitles[pathname] ?? "Dashboard"
}

/**
 * Wraps dashboard pages with the shared sidebar and breadcrumb chrome.
 *
 * @param children The dashboard page content to render inside the shell.
 * @returns The wrapped dashboard layout.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const currentTitle = getCurrentTitle(pathname)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
