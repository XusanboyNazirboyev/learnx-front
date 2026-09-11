import React from "react";
import { Wallet, CalendarCheck, BookOpen, TrendingUp, Clock, MapPin, CheckCircle2, Star } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import { StatusBadge } from "@/pages/admin/AdminDashboard";
// TODO: Replace mock student dashboard data with API responses before production.
import { studentInfo, studentSchedule, studentHomework, studentPayments, formatMoney } from "@/lib/mockData";

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative navy-gradient rounded-2xl p-6 lg:p-8 text-white overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full accent-gradient opacity-20 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-white/60 text-sm">Salom, 👋</p>
            <h2 className="font-heading font-bold text-2xl lg:text-3xl mt-1">{studentInfo.firstName} {studentInfo.lastName}</h2>
            <p className="text-white/60 mt-1">{studentInfo.course} · {studentInfo.group}</p>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider">Umumiy davomat</p>
              <p className="font-heading font-bold text-2xl mt-1">{studentInfo.attendance}%</p>
            </div>
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider">Kurs progresi</p>
              <p className="font-heading font-bold text-2xl mt-1">{studentInfo.progress}%</p>
            </div>
          </div>
        </div>
        <div className="relative mt-6 h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full accent-gradient rounded-full" style={{ width: `${studentInfo.progress}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Wallet} label="Joriy balans" value={formatMoney(studentInfo.balance)} accent="amber" subtitle="To'lov kutilmoqda" />
        <StatCard icon={CalendarCheck} label="Bu hafta darslar" value={studentSchedule.length} accent="accent" />
        <StatCard icon={BookOpen} label="Faol vazifalar" value={studentHomework.filter(h => h.status === "PENDING").length} accent="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
          <h3 className="font-heading font-bold text-lg mb-4">Haftalik dars jadvali</h3>
          <div className="space-y-3">
            {studentSchedule.map((s) => (
              <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-accent/40 hover:bg-accent/5 transition-all">
                <div className="w-14 h-14 rounded-xl accent-gradient text-white flex items-center justify-center font-heading font-bold text-sm shrink-0">
                  {s.day}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{s.title}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{s.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{s.room}</span>
                  </div>
                </div>
                <StatusBadge status={s.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Homework */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-heading font-bold text-lg mb-4">Uy vazifalari</h3>
          <div className="space-y-3">
            {studentHomework.map((h) => (
              <div key={h.id} className="p-3 rounded-xl border border-border hover:bg-muted/40 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-sm">{h.title}</p>
                  {h.grade && <span className="flex items-center gap-0.5 text-amber-500 font-semibold text-sm"><Star className="w-3.5 h-3.5 fill-amber-400" />{h.grade}</span>}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">Muddat: {h.deadline}</span>
                  <StatusBadge status={h.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payments */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <h3 className="font-heading font-bold text-lg">To'lovlar tarixi</h3>
          <TrendingUp className="w-5 h-5 text-emerald-500" />
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-6 py-3">Davr</th>
                <th className="text-left font-medium px-6 py-3">Sana</th>
                <th className="text-left font-medium px-6 py-3">Usul</th>
                <th className="text-left font-medium px-6 py-3">Summa</th>
                <th className="text-left font-medium px-6 py-3">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {studentPayments.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-3.5 font-medium">{p.period}</td>
                  <td className="px-6 py-3.5 text-muted-foreground">{p.date}</td>
                  <td className="px-6 py-3.5 text-muted-foreground">{p.method === "CARD" ? "Karta" : p.method === "CASH" ? "Naqd" : "O'tkazma"}</td>
                  <td className="px-6 py-3.5 font-semibold">{formatMoney(p.amount)}</td>
                  <td className="px-6 py-3.5"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}