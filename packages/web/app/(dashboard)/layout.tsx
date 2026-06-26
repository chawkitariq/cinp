import { DashboardShell } from "@/components/dashboard-shell"

/**
 * Layout wrapper for authenticated dashboard routes.
 *
 * @param children The dashboard route content.
 * @returns The shared dashboard shell.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardShell>{children}</DashboardShell>
}
