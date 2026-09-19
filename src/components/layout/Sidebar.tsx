import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/lib/AuthContext";
import { ShieldCheck,
  GraduationCap, LayoutDashboard, Users, UserCog, BookOpen, Users2, CreditCard,
  CalendarDays, ClipboardCheck, FileBarChart, DoorOpen, Settings, LogOut,
  User, Bell, BookMarked, FileCheck2, HelpCircle,
  PanelLeftClose, PanelLeftOpen,
} from "lucide-react";

const adminNav = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Talabalar", path: "/admin/students", icon: Users },
  { label: "O'qituvchilar", path: "/admin/teachers", icon: UserCog },
  { label: "Adminlar", path: "/admin/admins", icon: ShieldCheck },
  { label: "Kurslar", path: "/admin/courses", icon: BookOpen },
  { label: "Guruhlar", path: "/admin/groups", icon: Users2 },
  { label: "To'lovlar", path: "/admin/payments", icon: CreditCard },
  { label: "Xonalar", path: "/admin/rooms", icon: DoorOpen },
  { label: "Hisobotlar", path: "/admin/reports", icon: FileBarChart },
];

const teacherNav = [
  { label: "Dashboard", path: "/teacher", icon: LayoutDashboard },
  { label: "Guruhlarim", path: "/teacher/groups", icon: Users2 },
  { label: "Darslar", path: "/teacher/lessons", icon: CalendarDays },
  { label: "Davomat", path: "/teacher/attendance", icon: ClipboardCheck },
  { label: "Uy vazifalari", path: "/teacher/homework", icon: BookOpen },
];

const studentNav = [
  { label: "Dashboard", path: "/student", icon: LayoutDashboard },
  { label: "Guruhlarim", path: "/student/groups", icon: Users2 },
  { label: "Dars jadvali", path: "/student/schedule", icon: CalendarDays },
  { label: "Uy vazifalari", path: "/student/homework", icon: BookOpen },
  { label: "To'lovlar", path: "/student/payments", icon: CreditCard },
];

// Barcha rollar uchun umumiy bo'lim
const commonNav = [
  { label: "Profil", path: "/profile", icon: User },
  { label: "Bildirishnomalar", path: "/notifications", icon: Bell },
  { label: "Kutubxona", path: "/library", icon: BookMarked },
  { label: "Imtihonlar", path: "/exams", icon: FileCheck2 },
  { label: "Yordam markazi", path: "/help-center", icon: HelpCircle },
];

function NavItem({ item, onNavigate, collapsed }) {
  const location = useLocation();
  const active = location.pathname === item.path;
  const Icon = item.icon;
  const link = (
    <Link
      to={item.path}
      onClick={onNavigate}
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${collapsed ? "justify-center px-2" : ""} ${active
        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
        }`}
    >
      <Icon className={`w-[18px] h-[18px] ${active ? "text-sidebar-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-primary"}`} />
      {!collapsed && item.label}
      {active && !collapsed && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary" />}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={10}>
        {item.label}
      </TooltipContent>
    </Tooltip>
  );
}

export default function Sidebar({ role = "ADMIN", onNavigate, collapsed = false, onToggle }) {
  const { logout } = useAuth();
  const nav = role === "TEACHER" ? teacherNav : role === "STUDENT" ? studentNav : adminNav;

  return (
    <TooltipProvider delayDuration={150}>
      <aside className={`hidden lg:flex shrink-0 flex-col bg-sidebar text-sidebar-foreground fixed inset-y-0 left-0 z-40 transition-[width] duration-200 ${collapsed ? "w-[4.5rem]" : "w-64"}`}>
        <div className={`flex items-center h-16 border-b border-sidebar-border ${collapsed ? "flex-col justify-center gap-2 px-3" : "justify-between px-4"}`}>
          <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
            <div className={`${collapsed ? "w-8 h-8" : "w-9 h-9"} rounded-xl accent-gradient flex items-center justify-center shadow-lg shadow-accent/30 shrink-0`}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            {!collapsed && <div>
              <p className="font-heading font-bold text-lg leading-none text-white">Learnix</p>
              <p className="text-[11px] text-sidebar-foreground/60 mt-0.5">ERP / CRM</p>
            </div>}
          </div>
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Yon panelni ochish" : "Yon panelni yopish"}
            title={collapsed ? "Yon panelni ochish" : "Yon panelni yopish"}
            className="rounded-lg p-2 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-5 space-y-1">
          {!collapsed && <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40 mb-2">Asosiy</p>}
          {nav.map((item) => (
            <NavItem key={item.path} item={item} onNavigate={onNavigate} collapsed={collapsed} />
          ))}
          {!collapsed && <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40 mb-2 mt-6">Tizim</p>}
          {commonNav.map((item) => (
            <NavItem key={item.path} item={item} onNavigate={onNavigate} collapsed={collapsed} />
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
          <Link
            to="/settings"
            onClick={onNavigate}
            title={collapsed ? "Sozlamalar" : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground transition-all ${collapsed ? "justify-center" : ""}`}
          >
            <Settings className="w-[18px] h-[18px] text-sidebar-foreground/50" />
            {!collapsed && "Sozlamalar"}
          </Link>
          <button onClick={() => logout(true)} title={collapsed ? "Chiqish" : undefined} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground/70 hover:bg-destructive/20 hover:text-red-300 transition-all ${collapsed ? "justify-center" : ""}`}>
            <LogOut className="w-[18px] h-[18px]" />
            {!collapsed && "Chiqish"}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  );
}