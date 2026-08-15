import Link from "next/link";
import {
  BarChart3,
  CalendarClock,
  CalendarDays,
  Bell,
  Gift,
  Layers,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Package,
  Users,
  ExternalLink,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "../actions";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { site } from "@/config/site";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/sessions", label: "Sessions & Pricing", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Layers },
  { href: "/admin/settings", label: "Free Consultation", icon: Gift },
  { href: "/admin/availability", label: "Availability", icon: CalendarClock },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/reviews", label: "Ratings", icon: MessageSquareQuote },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Every page under this layout is behind the session guard.
  const session = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col bg-bg-subtle lg:flex-row">
      {/* Sidebar */}
      <aside className="border-b border-line bg-surface lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2.5 border-b border-line px-5 py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-fg text-fg-inverse">
              <BarChart3 className="h-4 w-4" strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Admin</p>
              <p className="truncate text-xs text-fg-subtle">{session.email}</p>
            </div>
          </div>

          <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-1 lg:flex-col lg:overflow-visible">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex shrink-0 items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
              >
                <item.icon className="h-4 w-4" strokeWidth={1.8} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="space-y-2 border-t border-line p-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
              View site
            </Link>

            <div className="flex items-center gap-2">
              <form action={logoutAction} className="flex-1">
                <button
                  type="submit"
                  className="flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:bg-danger-soft hover:text-danger"
                >
                  <LogOut className="h-4 w-4" strokeWidth={1.8} />
                  Sign out
                </button>
              </form>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-5 py-8 md:px-8">
        <div className="mx-auto max-w-5xl">{children}</div>
        <p className="mx-auto mt-10 max-w-5xl text-xs text-fg-subtle">
          {site.name} · mentorship platform
        </p>
      </main>
    </div>
  );
}
