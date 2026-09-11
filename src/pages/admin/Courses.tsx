import React from "react";
import { Users, Clock, CalendarDays, MoreHorizontal } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { StatusBadge } from "@/pages/admin/AdminDashboard";
// TODO: Replace mock courses with API data before production.
import { courses, formatMoney } from "@/lib/mockData";

export default function Courses() {
  return (
    <div>
      <PageHeader title="Kurslar" subtitle={`${courses.length} ta kurs`} actionLabel="Yangi kurs" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {courses.map((c) => (
          <div key={c.id} className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:shadow-foreground/5 transition-all">
            <div className="navy-gradient p-5 text-white relative">
              <div className="absolute top-4 right-4"><button className="p-1.5 rounded-lg hover:bg-white/10"><MoreHorizontal className="w-4 h-4" /></button></div>
              <div className="w-11 h-11 rounded-xl accent-gradient flex items-center justify-center mb-3"><Users className="w-5 h-5 text-white" /></div>
              <p className="font-heading font-bold text-lg leading-tight">{c.name}</p>
              <p className="text-white/50 text-sm mt-1">{formatMoney(c.price)}</p>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground"><CalendarDays className="w-4 h-4" />Davomiyligi</span>
                <span className="font-medium">{c.durationMonth} oy</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4" />Dars soati</span>
                <span className="font-medium">{c.durationHours} soat</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground"><Users className="w-4 h-4" />Talabalar</span>
                <span className="font-medium">{c.students} ta</span>
              </div>
              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Holat</span>
                <StatusBadge status={c.status} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}