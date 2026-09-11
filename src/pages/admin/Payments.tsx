import React from "react";
import { MoreHorizontal, Wallet } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { StatusBadge } from "@/pages/admin/AdminDashboard";
// TODO: Replace mock payments with API data before production.
import { payments, formatMoney } from "@/lib/mockData";

const methodLabel = { CARD: "Karta", CASH: "Naqd", TRANSFER: "O'tkazma" };

export default function Payments() {
  const totalPaid = payments.filter(p => p.status === "PAID").reduce((a, p) => a + p.amount, 0);
  const totalPending = payments.filter(p => p.status === "PENDING").reduce((a, p) => a + p.amount, 0);

  return (
    <div>
      <PageHeader title="To'lovlar" subtitle="To'lovlar tarixi va balanslar" actionLabel="Yangi to'lov" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3"><Wallet className="w-5 h-5" /></div>
          <p className="text-2xl font-heading font-bold">{formatMoney(totalPaid)}</p>
          <p className="text-sm text-muted-foreground">Jami to'langan</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3"><Wallet className="w-5 h-5" /></div>
          <p className="text-2xl font-heading font-bold">{formatMoney(totalPending)}</p>
          <p className="text-sm text-muted-foreground">Kutilmoqda</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-3"><Wallet className="w-5 h-5" /></div>
          <p className="text-2xl font-heading font-bold">{payments.length}</p>
          <p className="text-sm text-muted-foreground">Jami operatsiyalar</p>
        </div>
      </div>
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-6 py-3.5">Talaba</th>
                <th className="text-left font-medium px-6 py-3.5">Guruh</th>
                <th className="text-left font-medium px-6 py-3.5">Summa</th>
                <th className="text-left font-medium px-6 py-3.5">Usul</th>
                <th className="text-left font-medium px-6 py-3.5">Sana</th>
                <th className="text-left font-medium px-6 py-3.5">Holat</th>
                <th className="px-6 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-3.5 font-medium">{p.student}</td>
                  <td className="px-6 py-3.5 text-muted-foreground">{p.group}</td>
                  <td className="px-6 py-3.5 font-semibold">{formatMoney(p.amount)}</td>
                  <td className="px-6 py-3.5 text-muted-foreground">{methodLabel[p.method]}</td>
                  <td className="px-6 py-3.5 text-muted-foreground">{p.date}</td>
                  <td className="px-6 py-3.5"><StatusBadge status={p.status} /></td>
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