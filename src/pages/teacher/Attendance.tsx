import React, { useState } from "react";
import { Save, CheckCircle2, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
// TODO: Replace mock groups and students with API data before production.
import { teacherGroups, students } from "@/lib/mockData";

const MARKS = [
  { key: "PRESENT", label: "Keldi", on: "bg-emerald-500 text-white", off: "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10" },
  { key: "LATE", label: "Kechikdi", on: "bg-amber-500 text-white", off: "text-amber-600 dark:text-amber-400 hover:bg-amber-500/10" },
  { key: "ABSENT", label: "Kelmadi", on: "bg-red-500 text-white", off: "text-red-600 dark:text-red-400 hover:bg-red-500/10" },
];

export default function Attendance() {
  const [groupId, setGroupId] = useState(teacherGroups[0].id);
  const [date, setDate] = useState("2026-09-10");
  const [marks, setMarks] = useState({});
  const [saved, setSaved] = useState(false);

  const group = teacherGroups.find((g) => g.id === groupId);
  const count = (key) => Object.values(marks).filter((v) => v === key).length;
  const marked = Object.keys(marks).length;

  const setMark = (studentId, key) => {
    setMarks((prev) => ({ ...prev, [studentId]: key }));
    setSaved(false);
  };

  const save = () => setSaved(true);

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-card rounded-2xl border border-border p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {teacherGroups.map((g) => (
            <button
              key={g.id}
              onClick={() => { setGroupId(g.id); setMarks({}); setSaved(false); }}
              className={`h-9 px-4 rounded-xl text-sm font-medium border transition-colors ${groupId === g.id ? "navy-gradient text-white border-transparent" : "bg-card border-border hover:bg-muted"
                }`}
            >
              {g.name}
            </button>
          ))}
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => { setDate(e.target.value); setSaved(false); }}
          className="h-10 px-3 rounded-xl bg-muted/40 border border-border text-sm outline-none sm:ml-auto"
        />
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <p className="font-heading font-bold">{group.name} — davomat</p>
            <p className="text-xs text-muted-foreground mt-0.5">{date} · {group.schedule}</p>
          </div>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><Users2 className="w-4 h-4" />{marked}/{students.length}</span>
        </div>
        <div className="divide-y divide-border">
          {students.map((s, i) => (
            <div key={s.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-3.5 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-lg navy-gradient flex items-center justify-center text-white text-xs font-semibold shrink-0">
                  {s.firstName[0]}{s.lastName[0]}
                </div>
                <p className="font-medium text-sm truncate">{i + 1}. {s.firstName} {s.lastName}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {MARKS.map((m) => {
                  const active = marks[s.id] === m.key;
                  return (
                    <button
                      key={m.key}
                      onClick={() => setMark(s.id, m.key)}
                      className={`h-8 px-3 rounded-lg text-xs font-semibold border transition-colors ${active ? `${m.on} border-transparent` : `bg-card border-border ${m.off}`
                        }`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />Keldi: <b>{count("PRESENT")}</b></span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" />Kechikdi: <b>{count("LATE")}</b></span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" />Kelmadi: <b>{count("ABSENT")}</b></span>
        </div>
        <div className="sm:ml-auto flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />Davomat saqlandi
            </span>
          )}
          <Button onClick={save} disabled={marked === 0} className="navy-gradient hover:opacity-90">
            <Save className="w-4 h-4 mr-2" />Saqlash
          </Button>
        </div>
      </div>
    </div>
  );
}