/**
 * Dashboard Layout - Premium Dark Theme
 * Uses the same obsidian & gold aesthetic as the main site
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-10 min-h-screen bg-[var(--color-background)]">
      {children}
    </div>
  );
}
