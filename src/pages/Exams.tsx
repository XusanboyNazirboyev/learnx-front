import React from "react";
import { ClipboardCheck, Trophy, Target, Star } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import { StatusBadge } from "@/pages/admin/AdminDashboard";
// TODO: Replace mock exams and results with API data before production.
import { exams, examResults } from "@/lib/mockData";

const examStatus = {
  COMPLETED: "Yakunlangan",
  SCHEDULED: "Rejada",
};

export default function Exams() {
  const completed = exams.filter((e) => e.status === "COMPLETED");
  const avgScore = completed.length
    ? (completed.reduce((a, e) => a + e.avgScore, 0) / completed.length).toFixed(1)
    : "—";
  const passRate = completed.length
    ? Math.round(completed.reduce((a, e) => a + e.passRate, 0) / completed.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={ClipboardCheck} label="Jami imtihonlar" value={exams.length} accent="primary" />
        <StatCard icon={Trophy} label="O'rtacha baho (5 ball)" value={avgScore} accent="green" subtitle={`${completed.length} ta yakunlangan`} />
        <StatCard icon={Target} label="O'rtacha o'tish darajasi" value={`${passRate}%`} accent="accent" />
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h3 className="font-heading font-bold text-lg">Imtihonlar jadvali</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Rejalashtirilgan va yakunlangan nazorat ishlari</p>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-6 py-3">Imtihon</th>
                <th className="text-left font-medium px-6 py-3">Guruh</th>
                <th className="text-left font-medium px-6 py-3">Sana</th>
                <th className="text-left font-medium px-6 py-3">Ishtirok</th>
                <th className="text-left font-medium px-6 py-3">O'rtacha baho</th>
                <th className="text-left font-medium px-6 py-3">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {exams.map((e) => (
                <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-3.5 font-medium">{e.name}</td>
                  <td className="px-6 py-3.5 text-muted-foreground">{e.group}</td>
                  <td className="px-6 py-3.5 text-muted-foreground">{e.date}</td>
                  <td className="px-6 py-3.5 text-muted-foreground">{e.participants} ta</td>
                  <td className="px-6 py-3.5">
                    {e.avgScore ? (
                      <span className="flex items-center gap-1 font-semibold text-amber-500"><Star className="w-3.5 h-3.5 fill-amber-400" />{e.avgScore}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${e.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground"
                      }`}>
                      {examStatus[e.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h3 className="font-heading font-bold text-lg">Yakunlangan imtihon natijalari</h3>
          <p className="text-sm text-muted-foreground mt-0.5">React intermediat nazorat — Frontend-N10</p>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-6 py-3">Talaba</th>
                <th className="text-left font-medium px-6 py-3">Ball (100)</th>
                <th className="text-left font-medium px-6 py-3">Baho</th>
                <th className="text-left font-medium px-6 py-3">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {examResults.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-3.5 font-medium">{r.student}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-28 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${r.score >= 60 ? "bg-emerald-500" : "bg-red-500"}`}
                          style={{ width: `${r.score}%` }}
                        />
                      </div>
                      <span className="font-semibold">{r.score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="flex items-center gap-1 font-semibold text-amber-500"><Star className="w-3.5 h-3.5 fill-amber-400" />{r.grade}</span>
                  </td>
                  <td className="px-6 py-3.5"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}