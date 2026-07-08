import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Utensils, BookOpen, Clock, CalendarCheck, LogOut } from "lucide-react";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setLocation("/admin");
    }
  }, [setLocation]);

  if (!isMounted) return null;

  if (!localStorage.getItem("admin_token")) {
    return null; 
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setLocation("/admin");
  };

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/recipes", label: "Recipes", icon: Utensils },
    { href: "/admin/blog", label: "Blog", icon: BookOpen },
    { href: "/admin/timeslots", label: "Time Slots", icon: Clock },
    { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  ];

  return (
    <div className="min-h-[100dvh] bg-bone/30 flex text-ink">
      <aside className="w-64 bg-cream border-r border-ink/10 flex flex-col fixed inset-y-0 left-0">
        <div className="p-6 border-b border-ink/10">
          <Link href="/" className="font-display text-xl tracking-tight text-ink block">
            Dr. Shweta Tripathi<span className="text-terracotta">.</span>
          </Link>
          <div className="text-xs tracking-widest uppercase text-ink/50 mt-1">Admin Panel</div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href || location.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-olive text-cream font-medium"
                    : "text-ink/70 hover:bg-bone hover:text-ink"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive ? "text-cream" : "text-ink/50")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-ink/10">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
