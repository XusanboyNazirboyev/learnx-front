import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Bell, Menu, ChevronDown } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/lib/AuthContext";

export default function Topbar({ title, subtitle, role = "ADMIN", onMenuClick }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const roleLabel = role === "TEACHER" ? "O'qituvchi" : role === "STUDENT" ? "Talaba" : "Administrator";
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Foydalanuvchi";
  const shortName = [user?.firstName, user?.lastName?.[0]].filter(Boolean).join(" ");
  const initials = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "U";

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  return (
    <header className="sticky top-0 z-30 h-16 bg-background/80 glass border-b border-border flex items-center gap-4 px-4 lg:px-8">
      <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-muted">
        <Menu className="w-5 h-5" />
      </button>

      <div className="min-w-0">
        <h1 className="font-heading font-bold text-lg lg:text-xl text-foreground truncate">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground truncate hidden sm:block">{subtitle}</p>}
      </div>

      <div className="ml-auto flex items-center gap-2 lg:gap-3">
        <div className="hidden md:flex items-center gap-2 h-10 px-3 rounded-xl bg-muted/70 border border-border w-64">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            placeholder="Qidirish..."
            className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground"
          />
          <kbd className="text-[10px] font-mono text-muted-foreground bg-card px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
        </div>

        <ThemeToggle />
        <Link to="/notifications" className="relative p-2.5 rounded-xl hover:bg-muted transition-colors" aria-label="Bildirishnomalar">
          <Bell className="w-5 h-5 text-foreground/70" />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-accent ring-2 ring-background" />
        </Link>

        <div ref={profileMenuRef} className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-muted transition-colors"
          >
            {user?.photo ? (
              <img src={user.photo} alt={fullName} className="w-9 h-9 rounded-lg object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-lg navy-gradient flex items-center justify-center text-white text-sm font-semibold">
                {initials}
              </div>
            )}
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold leading-none">{shortName || fullName}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{roleLabel}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
          </button>
          {open && (
            <div className="absolute right-0 top-12 w-56 bg-popover rounded-xl shadow-xl border border-border py-2 z-50">
              <div className="px-4 py-2 border-b border-border">
                <p className="text-sm font-semibold">{fullName}</p>
                <p className="text-xs text-muted-foreground">{user?.email || user?.phone || ""}</p>
              </div>
              <Link to="/profile" onClick={() => setOpen(false)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted">Profil</Link>
              <Link to="/settings" onClick={() => setOpen(false)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted">Sozlamalar</Link>
              <button onClick={() => logout(true)} className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10">Chiqish</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}