"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp, LayoutDashboard, List, Calendar, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/lancamentos", label: "Lançamentos", icon: List },
  { href: "/mensal", label: "Visão Mensal", icon: Calendar },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-[#16213E] border-r border-white/10 px-4 py-6">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="bg-[#00B4D8]/10 p-2 rounded-xl">
          <TrendingUp className="h-6 w-6 text-[#00B4D8]" />
        </div>
        <div>
          <h1 className="font-bold text-white text-lg leading-tight">FinDash</h1>
          <p className="text-[#8D99AE] text-xs">Gestão Financeira</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
              pathname === href || pathname.startsWith(href + "/")
                ? "bg-[#00B4D8]/10 text-[#00B4D8]"
                : "text-[#8D99AE] hover:text-white hover:bg-white/5"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="pt-4 border-t border-white/10">
        <form action={logout}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start gap-3 text-[#8D99AE] hover:text-[#EF476F] hover:bg-[#EF476F]/10"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </form>
      </div>
    </aside>
  );
}
