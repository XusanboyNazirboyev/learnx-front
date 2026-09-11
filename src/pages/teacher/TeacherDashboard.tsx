import React from "react";
import { Users2, CalendarCheck, ClipboardList, BookOpen, Clock, MapPin, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import { StatusBadge } from "@/pages/admin/AdminDashboard";
import { teacherGroups, teacherLessons, homeworkToCheck } from "@/lib/mockData";

export default function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Users2} label="Guruhlarim" value={teacherGroups.length} accent="primary" />
        <StatCard icon={Users2} label="Talabalarim" value={46} accent="accent" />
        <StatCard icon={CalendarCheck} label="Bu hafta darslar" value={6} accent="green" />
        <StatCard icon={ClipboardList} label="Tekshirilmagan vazifa" value={homeworkToCheck.length} accent="amber" />
      </div>

      {/* My groups */}
      <div>
        <h3 className="font-heading font-bold text-lg mb-4">Mening guruhlarim</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teacherGroups.map((g) => (
            <div key={g.id} className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:shadow-foreground/5 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-heading font-bold text-lg">{g.name}</p>
                  <p className="text-sm text-muted-foreground">{g.course}</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-accent/10 text-accent">{g.students} talaba</span>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4" />{g.schedule}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4" />{g.room}</div>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Keyingi dars</p>
                  <p className="text-sm font-semibold">{g.nextLesson}</p>
                </div>
                <button className="text-sm font-medium text-accent flex items-center gap-1 hover:gap-2 transition-all">Batafsil <ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming lessons */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-heading font-bold text-lg mb-4">Darslar jadvali</h3>
          <div className="space-y-3">
            {teacherLessons.map((l) => (
              <div key={l.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/40 transition-colors">
                <div className="w-12 h-12 rounded-xl navy-gradient text-white flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] leading-none opacity-70">{new Date(l.date).toLocaleDateString("ru-RU", { day: "2-digit", month: "short" })}</span>
                  <span className="text-sm font-bold leading-none mt-0.5">{l.time}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{l.title}</p>
                  <p className="text-sm text-muted-foreground">{l.group}</p>
                </div>
                {l.status === "DONE" ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600"><CheckCircle2 className="w-4 h-4" />{l.attendance}/18</span>
                ) : (
                  <StatusBadge status={l.status} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Homework to check */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-heading font-bold text-lg mb-4">Tekshirish kerak vazifalar</h3>
          <div className="space-y-3">
            {homeworkToCheck.map((h) => (
              <div key={h.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0"><AlertCircle className="w-5 h-5" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{h.title}</p>
                  <p className="text-sm text-muted-foreground">{h.student} · {h.group}</p>
                </div>
                <StatusBadge status={h.status} />
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Barcha vazifalarni ko'rish</button>
        </div>
      </div>
    </div>
  );
}