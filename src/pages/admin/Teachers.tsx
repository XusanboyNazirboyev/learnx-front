import React from "react";
import { MoreHorizontal } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { StatusBadge } from "@/pages/admin/AdminDashboard";
import { teachers, formatMoney } from "@/lib/mockData";

const salaryLabel = { FIXED: "Belgilangan", PERCENTAGE: "Foiz", HOURLY: "Soatlik" };

export default function Teachers() {
  return (
    <div>
      <PageHeader title="O'qituvchilar" subtitle={`${teachers.length} ta o'qituvchi`} actionLabel="Yangi o'qituvchi" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {teachers.map((t) => (
          <div key={t.id} className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:shadow-foreground/5 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl navy-gradient flex items-center justify-center text-white font-semibold">{t.firstName[0]}{t.lastName[0]}</div>
                <div>
                  <p className="font-heading font-bold">{t.firstName} {t.lastName}</p>
                  <p className="text-sm text-muted-foreground">{t.specialty}</p>
                </div>
              </div>
              <button className="p-1.5 rounded-lg hover:bg-muted"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-border text-center">
              <div><p className="text-xs text-muted-foreground">Guruhlar</p><p className="font-heading font-bold mt-0.5">{t.groups}</p></div>
              <div><p className="text-xs text-muted-foreground">Maosh turi</p><p className="font-semibold text-xs mt-1">{salaryLabel[t.salaryType]}</p></div>
              <div><p className="text-xs text-muted-foreground">{t.salaryType === "PERCENTAGE" ? "Foiz" : "Maosh"}</p><p className="font-heading font-bold mt-0.5 text-sm">{t.salaryType === "PERCENTAGE" ? `${t.salaryAmount}%` : formatMoney(t.salaryAmount)}</p></div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-muted-foreground">{t.phone}</span>
              <StatusBadge status={t.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}