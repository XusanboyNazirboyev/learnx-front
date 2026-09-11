import React from "react";
import { MoreHorizontal } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { StatusBadge } from "@/pages/admin/AdminDashboard";
import { students, formatMoney } from "@/lib/mockData";

export default function Students() {
  return (
    <div>
      <PageHeader title="Talabalar" subtitle={`${students.length} ta talaba ro'yxatdan o'tgan`} actionLabel="Yangi talaba" />
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-6 py-3.5">Talaba</th>
                <th className="text-left font-medium px-6 py-3.5">Guruh</th>
                <th className="text-left font-medium px-6 py-3.5">Telefon</th>
                <th className="text-left font-medium px-6 py-3.5">Email</th>
                <th className="text-left font-medium px-6 py-3.5">Balans</th>
                <th className="text-left font-medium px-6 py-3.5">Holat</th>
                <th className="px-6 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg navy-gradient flex items-center justify-center text-white text-xs font-semibold">{s.firstName[0]}{s.lastName[0]}</div>
                      <div><p className="font-medium">{s.firstName} {s.lastName}</p><p className="text-xs text-muted-foreground">Qo'shilgan: {s.joinedAt}</p></div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">{s.group}</td>
                  <td className="px-6 py-3.5 text-muted-foreground">{s.phone}</td>
                  <td className="px-6 py-3.5 text-muted-foreground">{s.email}</td>
                  <td className="px-6 py-3.5 font-medium">{s.balance > 0 ? <span className="text-amber-600">{formatMoney(s.balance)}</span> : <span className="text-emerald-600">To'langan</span>}</td>
                  <td className="px-6 py-3.5"><StatusBadge status={s.status} /></td>
                  <td className="px-6 py-3.5"><button className="p-1.5 rounded-lg hover:bg-muted"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}