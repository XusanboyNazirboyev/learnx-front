import React from "react";
import { Wallet, TrendingUp, TrendingDown, CalendarCheck, Star } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import StatCard from "@/components/ui/StatCard";
// TODO: Replace mock reports with API data before production.
import { reportSeries, groupAttendance, courseReports, formatMoney } from "@/lib/mockData";

const tooltipStyle = { borderRadius: 12, border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--popover))", color: "hsl(var(--popover-foreground))" };

export default function Reports() {
  const totalRevenue = reportSeries.reduce((a, r) => a + r.revenue, 0);
  const totalExpenses = reportSeries.reduce((a, r) => a + r.expenses, 0);
  const totalProfit = reportSeries.reduce((a, r) => a + r.profit, 0);
  const avgAttendance = Math.round(groupAttendance.reduce((a, g) => a + g.rate, 0) / groupAttendance.length);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Wallet} label="Yillik daromad" value={formatMoney(totalRevenue * 1000000)} change="+12.4%" trend="up" accent="primary" />
        <StatCard icon={TrendingDown} label="Xarajatlar" value={formatMoney(totalExpenses * 1000000)} change="+2.1%" trend="up" accent="amber" />
        <StatCard icon={TrendingUp} label="Sof foyda" value={formatMoney(totalProfit * 1000000)} change="+18.6%" trend="up" accent="green" />
        <StatCard icon={CalendarCheck} label="O'rtacha davomat" value={`${avgAttendance}%`} change="+1.2%" trend="up" accent="accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
          <h3 className="font-heading font-bold text-lg">Moliyaviy ko'rsatkichlar</h3>
          <p className="text-sm text-muted-foreground mb-6">Oylik daromad, xarajat va foyda (mln so'm)</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={reportSeries} margin={{ left: -20, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" name="Daromad" stroke="hsl(var(--chart-1))" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="expenses" name="Xarajat" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="profit" name="Foyda" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-heading font-bold text-lg">Guruhlar bo'yicha davomat</h3>
          <p className="text-sm text-muted-foreground mb-6">O'rtacha foiz (%)</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={groupAttendance} layout="vertical" margin={{ left: 10, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis type="category" dataKey="group" width={90} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted))" }} />
              <Bar dataKey="rate" name="Davomat" fill="hsl(var(--chart-2))" radius={[0, 6, 6, 0]} maxBarSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h3 className="font-heading font-bold text-lg">Kurslar kesimi hisoboti</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Yillik daromad va akademik ko'rsatkichlar</p>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-6 py-3">Kurs</th>
                <th className="text-left font-medium px-6 py-3">Talabalar</th>
                <th className="text-left font-medium px-6 py-3">Daromad</th>
                <th className="text-left font-medium px-6 py-3">Davomat</th>
                <th className="text-left font-medium px-6 py-3">Reyting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {courseReports.map((c) => (
                <tr key={c.course} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-3.5 font-medium">{c.course}</td>
                  <td className="px-6 py-3.5 text-muted-foreground">{c.students}</td>
                  <td className="px-6 py-3.5 font-semibold">{formatMoney(c.revenue * 1000000)}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${c.attendance}%` }} />
                      </div>
                      <span className="text-muted-foreground">{c.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="flex items-center gap-1 font-semibold text-amber-500"><Star className="w-3.5 h-3.5 fill-amber-400" />{c.rating}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}