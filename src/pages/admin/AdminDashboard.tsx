import React from "react";
import { Users, UserCog, Users2, BookOpen, Wallet, TrendingUp, CalendarCheck, Clock, MoreHorizontal } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import StatCard from "@/components/ui/StatCard";
// TODO: Replace mock dashboard metrics and charts with API responses before production.
import { stats, revenueSeries, attendanceSeries, courseDistribution, students, formatMoney } from "@/lib/mockData";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Jami talabalar" value={stats.totalStudents.toLocaleString()} change="+8.2%" trend="up" accent="primary" />
        <StatCard icon={UserCog} label="O'qituvchilar" value={stats.totalTeachers} change="+3" trend="up" accent="accent" />
        <StatCard icon={Users2} label="Faol guruhlar" value={stats.activeGroups} change="+5" trend="up" accent="green" />
        <StatCard icon={Wallet} label="Oylik daromad" value={formatMoney(stats.monthlyRevenue)} change="+4.5%" trend="up" accent="violet" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading font-bold text-lg">Daromad dinamikasi</h3>
              <p className="text-sm text-muted-foreground">Oylik daromad va maqsad (mln so'm)</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary" />Daromad</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-accent/40 border border-accent" />Maqsad</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueSeries} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(222 68% 28%)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="hsl(222 68% 28%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--popover))", color: "hsl(var(--popover-foreground))", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }} />
              <Area type="monotone" dataKey="target" stroke="hsl(199 76% 56%)" strokeWidth={2} strokeDasharray="5 5" fill="none" />
              <Area type="monotone" dataKey="revenue" stroke="hsl(222 68% 28%)" strokeWidth={3} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-heading font-bold text-lg">Kurslar taqsimoti</h3>
          <p className="text-sm text-muted-foreground mb-4">Talabalar yo'nalish bo'yicha</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={courseDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
                {courseDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--popover))", color: "hsl(var(--popover-foreground))" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {courseDistribution.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />{c.name}</span>
                <span className="font-semibold">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance + quick stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading font-bold text-lg">Haftalik davomat</h3>
              <p className="text-sm text-muted-foreground">Kelgan va kelmagan talabalar (%)</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={attendanceSeries} margin={{ left: -20, right: 8, top: 8 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--popover))", color: "hsl(var(--popover-foreground))" }} cursor={{ fill: "hsl(var(--muted))" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="present" name="Kelgan" fill="hsl(222 68% 28%)" radius={[6, 6, 0, 0]} maxBarSize={28} />
              <Bar dataKey="absent" name="Kelmagan" fill="hsl(199 76% 56%)" radius={[6, 6, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-heading font-bold text-lg mb-4">Tezkor ko'rsatkichlar</h3>
          <div className="space-y-4">
            <QuickStat icon={CalendarCheck} label="Davomat darajasi" value={`${stats.attendanceRate}%`} accent="green" />
            <QuickStat icon={TrendingUp} label="Yangi talabalar (oy)" value={`+${stats.newStudentsThisMonth}`} accent="accent" />
            <QuickStat icon={Clock} label="Kutilayotgan to'lovlar" value={stats.pendingPayments} accent="amber" />
            <QuickStat icon={BookOpen} label="Faol kurslar" value={stats.totalCourses} accent="violet" />
          </div>
        </div>
      </div>

      {/* Recent students table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h3 className="font-heading font-bold text-lg">So'nggi qo'shilgan talabalar</h3>
            <p className="text-sm text-muted-foreground">Eng yangi 5 ta talaba</p>
          </div>
          <button className="text-sm font-medium text-accent hover:underline flex items-center gap-1">Barchasini ko'rish</button>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-6 py-3">Talaba</th>
                <th className="text-left font-medium px-6 py-3">Guruh</th>
                <th className="text-left font-medium px-6 py-3">Telefon</th>
                <th className="text-left font-medium px-6 py-3">Balans</th>
                <th className="text-left font-medium px-6 py-3">Holat</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {students.slice(0, 5).map((s) => (
                <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg navy-gradient flex items-center justify-center text-white text-xs font-semibold">
                        {s.firstName[0]}{s.lastName[0]}
                      </div>
                      <span className="font-medium">{s.firstName} {s.lastName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-muted-foreground">{s.group}</td>
                  <td className="px-6 py-3.5 text-muted-foreground">{s.phone}</td>
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

function QuickStat({ icon: Icon, label, value, accent }) {
  const colors = { green: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10", accent: "text-accent bg-accent/10", amber: "text-amber-600 dark:text-amber-400 bg-amber-500/10", violet: "text-violet-600 dark:text-violet-400 bg-violet-500/10" };
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[accent]}`}><Icon className="w-5 h-5" /></div>
      <div className="flex-1"><p className="text-sm text-muted-foreground">{label}</p></div>
      <p className="font-heading font-bold text-lg">{value}</p>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { dot: string; bg: string; text: string; label: string }> = {
    ACTIVE:         { dot: "bg-emerald-500",              bg: "bg-emerald-500/10",   text: "text-emerald-600 dark:text-emerald-400",  label: "Faol" },
    INACTIVE:       { dot: "bg-slate-400",                bg: "bg-muted",            text: "text-muted-foreground",                   label: "Nofaol" },
    FREEZE:         { dot: "bg-amber-500",                bg: "bg-amber-500/10",     text: "text-amber-600 dark:text-amber-400",      label: "Muzlatilgan" },
    GRADUATED:      { dot: "bg-accent",                   bg: "bg-accent/10",        text: "text-accent",                             label: "Bitirgan" },
    PLANNED:        { dot: "bg-slate-400",                bg: "bg-muted",            text: "text-muted-foreground",                   label: "Rejalashtirilgan" },
    COMPLETED:      { dot: "bg-violet-500",               bg: "bg-violet-500/10",    text: "text-violet-600 dark:text-violet-400",    label: "Tugatilgan" },
    CANCELLED:      { dot: "bg-red-400",                  bg: "bg-red-500/10",       text: "text-red-600 dark:text-red-400",          label: "Bekor qilingan" },
    PENDING:        { dot: "bg-amber-500",                bg: "bg-amber-500/10",     text: "text-amber-600 dark:text-amber-400",      label: "Kutilmoqda" },
    PAID:           { dot: "bg-emerald-500",              bg: "bg-emerald-500/10",   text: "text-emerald-600 dark:text-emerald-400",  label: "To'langan" },
    REFUNDED:       { dot: "bg-red-400",                  bg: "bg-red-500/10",       text: "text-red-600 dark:text-red-400",          label: "Qaytarilgan" },
    NEEDS_REVISION: { dot: "bg-amber-500",                bg: "bg-amber-500/10",     text: "text-amber-600 dark:text-amber-400",      label: "Tahrir kerak" },
    REJECTED:       { dot: "bg-red-400",                  bg: "bg-red-500/10",       text: "text-red-600 dark:text-red-400",          label: "Rad etilgan" },
    ACCEPTED:       { dot: "bg-emerald-500",              bg: "bg-emerald-500/10",   text: "text-emerald-600 dark:text-emerald-400",  label: "Qabul qilingan" },
  };

  const c = config[status] ?? config.INACTIVE;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
      {c.label}
    </span>
  );
}