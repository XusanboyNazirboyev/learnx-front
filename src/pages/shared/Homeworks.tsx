import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { groupsApi } from "@/api/services/groupsApi";
import { studentsApi } from "@/api/services/studentsApi";
import { profileApi } from "@/api/services/profileApi";
import { homeworkApi } from "@/api/services/homeworkApi";
import StatusFilterDropdown from "@/components/shared/StatusFilterDropdown";
import { HomeworkStatusPill, deriveHwStatus } from "@/components/shared/HomeworkStatus";
import { formatDate } from "@/lib/format";
import type { PaginationQuery } from "@/api/types";

type HwRow = {
  id: number;
  title: string;
  deadline: string;
  lessonId: number;
  groupName: string;
  _count?: { submissions: number };
};

type Sub = { homeworkId?: number; status?: string };

export default function Homeworks() {
  const { user } = useAuth();
  const isStudent = user?.role === "STUDENT";
  const [rows, setRows] = useState<HwRow[]>([]);
  const [subs, setSubs] = useState<Record<number, Sub>>({});
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    let alive = true;
    setLoading(true);
    const groupsPromise = isStudent
      ? studentsApi.my().then((res) => {
          const p = res as { studentGroups?: Array<{ group: { id: number; name: string } }> };
          return (p.studentGroups || []).map((sg) => sg.group);
        })
      : profileApi.me().then(async (me) => {
          const tid = (me as unknown as { teacherProfile?: { id?: number } }).teacherProfile?.id;
          const q = { teacherId: tid, limit: 100 } as PaginationQuery;
          const res = await groupsApi.list(q);
          return (res.items as Array<{ id: number; name: string }>).map((g) => ({ id: g.id, name: g.name }));
        });

    groupsPromise
      .then(async (gs) => {
        const hwNested = await Promise.all(
          gs.map((g) =>
            homeworkApi.list(g.id).then((list) =>
              ((list as HwRow[]) || []).map((r) => ({ ...r, groupName: g.name })),
            ),
          ),
        );
        const subRes = isStudent ? await homeworkApi.mySubmissions() : null;
        return { hwNested, subRes };
      })
      .then((res) => {
        if (!alive) return;
        const flat = res.hwNested
          .flat()
          .filter((r) => r && r.id)
          .sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
        setRows(flat);
        const sm: Record<number, Sub> = {};
        const arr = Array.isArray(res.subRes) ? (res.subRes as Sub[]) : ((res.subRes as { items?: Sub[] })?.items || []);
        arr.forEach((x) => { if (x.homeworkId) sm[x.homeworkId] = x; });
        setSubs(sm);
      })
      .catch((err) => { if (alive) setError(err.message || "Uy vazifalarini yuklashda xatolik"); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [user?.id, isStudent]);

  const filtered = !isStudent || filter === "ALL"
    ? rows
    : rows.filter((r) => deriveHwStatus(r, subs[r.id]) === filter);

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold">Uy vazifalari</h2>
      <p className="text-sm text-muted-foreground mt-0.5">{rows.length} ta uy vazifasi</p>

      {isStudent && (
        <div className="mt-5 flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Uy vazifa statusi</span>
          <StatusFilterDropdown value={filter} onChange={setFilter} />
        </div>
      )}

      {loading && <p className="mt-6 text-sm text-muted-foreground">Yuklanmoqda...</p>}
      {error && <p className="mt-6 text-sm text-destructive">{error}</p>}

      {!loading && !error && (
        <div className="mt-6 bg-card rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="px-6 py-3.5 font-medium">Uy vazifasi</th>
                  <th className="px-6 py-3.5 font-medium">Guruh</th>
                  {isStudent
                    ? <th className="px-6 py-3.5 font-medium">Uyga vazifa holati</th>
                    : <th className="px-6 py-3.5 font-medium">Topshirganlar</th>}
                  <th className="px-6 py-3.5 font-medium">Tugash vaqti</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((h) => (
                  <tr key={h.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-3.5 font-medium">{h.title}</td>
                    <td className="px-6 py-3.5 text-muted-foreground">{h.groupName}</td>
                    {isStudent
                      ? <td className="px-6 py-3.5"><HomeworkStatusPill status={deriveHwStatus(h, subs[h.id])} /></td>
                      : <td className="px-6 py-3.5">
                          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-border bg-muted text-sm font-semibold">
                            {h._count?.submissions ?? 0}
                          </span>
                        </td>}
                    <td className="px-6 py-3.5 text-muted-foreground">{formatDate(h.deadline)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {!loading && !error && filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">Uy vazifasi topilmadi.</p>
      )}
    </div>
  );
}
