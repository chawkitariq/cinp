import { DashboardShell } from "@/components/dashboard-shell"

/**
 * Layout wrapper for authenticated dashboard routes.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardShell>{children}</DashboardShell>
}
