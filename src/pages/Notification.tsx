import React, { useEffect, useState } from "react";
import { Wallet, CalendarDays, BookOpen, Settings, CheckCheck, Bell } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
// TODO: Replace mock notifications with API data before production.
import { notifications as initialNotifications } from "@/lib/mockData";

const typeMeta = {
  PAYMENT: { label: "To'lovlar", icon: Wallet, cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  LESSON: { label: "Darslar", icon: CalendarDays, cls: "bg-accent/10 text-accent" },
  HOMEWORK: { label: "Vazifalar", icon: BookOpen, cls: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  SYSTEM: { label: "Tizim", icon: Settings, cls: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
};

export default function Notifications() {
  const { user } = useAuth();
  const role = user?.role || "STUDENT";
  const roleNotifications = initialNotifications.filter((notification) => (
    notification.roles.includes(role) &&
    (role !== "STUDENT" || !notification.recipientPhone || notification.recipientPhone === user?.phone)
  ));
  const [items, setItems] = useState(roleNotifications);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    setItems(roleNotifications);
    setFilter("ALL");
  }, [role]);

  const unread = items.filter((n) => n.unread).length;
  const filtered = filter === "ALL" ? items : items.filter((n) => n.type === filter);

  const markAll = () => setItems(items.map((n) => ({ ...n, unread: false })));

  const chips = [{ key: "ALL", label: "Barchasi" }, ...Object.entries(typeMeta).map(([key, m]) => ({ key, label: m.label }))];

  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {chips.map((c) => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={`h-9 px-3.5 rounded-xl text-sm font-medium border transition-colors ${filter === c.key ? "navy-gradient text-white border-transparent" : "bg-card border-border hover:bg-muted"
              }`}
          >
            {c.label}
            {c.key === "ALL" && unread > 0 && <span className="ml-1.5 text-accent">{unread}</span>}
          </button>
        ))}
        <button
          onClick={markAll}
          disabled={unread === 0}
          className="ml-auto h-9 px-3.5 rounded-xl text-sm font-medium border border-border bg-card hover:bg-muted transition-colors flex items-center gap-1.5 disabled:opacity-50"
        >
          <CheckCheck className="w-4 h-4" />Barchasini o'qilgan deb belgilash
        </button>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-card rounded-2xl border border-border p-12 text-center">
            <Bell className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Bu yozuvda bildirishnomalar yo'q</p>
          </div>
        )}
        {filtered.map((n) => {
          const meta = typeMeta[n.type];
          const Icon = meta.icon;
          return (
            <div
              key={n.id}
              className={`flex items-start gap-4 p-4 rounded-2xl border transition-colors ${n.unread ? "bg-accent/5 border-accent/30" : "bg-card border-border"
                }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${meta.cls}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{n.title}</p>
                  {n.unread && <span className="w-2 h-2 rounded-full bg-accent shrink-0" />}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{n.text}</p>
                <p className="text-xs text-muted-foreground/70 mt-1.5">{n.time}</p>
              </div>
              <span className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-muted text-muted-foreground shrink-0">{meta.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}