import React from "react";
import { MoreHorizontal, Users2 } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { StatusBadge } from "@/pages/admin/AdminDashboard";
// TODO: Replace mock groups with API data before production.
import { groups } from "@/lib/mockData";

export default function Groups() {
  return (
    <div>
      <PageHeader title="Guruhlar" subtitle={`${groups.length} ta guruh`} actionLabel="Yangi guruh" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {groups.map((g) => {
          const pct = Math.min(100, Math.round((g.students / g.maxStudent) * 100));
          return (
            <div key={g.id} className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:shadow-foreground/5 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-heading font-bold text-lg">{g.name}</p>
                  <p className="text-sm text-muted-foreground">{g.course}</p>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-muted"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">O'qituvchi: <span className="text-foreground font-medium">{g.teacher}</span></div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><Users2 className="w-4 h-4" />To'lganlik</span>
                  <span className="font-medium">{g.students}/{g.maxStudent}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full ${pct >= 90 ? "bg-amber-500" : pct >= 70 ? "bg-accent" : "bg-emerald-500"}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <span className="text-xs text-muted-foreground">Boshlanish: {g.startDate}</span>
                <StatusBadge status={g.status} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}