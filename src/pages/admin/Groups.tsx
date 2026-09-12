import React, { useEffect, useState } from "react";
import { MoreHorizontal, Users2 } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { StatusBadge } from "@/pages/admin/AdminDashboard";
import { groupsApi } from "@/api/services/groupsApi";
import AdminFormDrawer from "@/components/admin/AdminFormDrawer";

type Group = {
  id: number;
  name: string;
  status: string;
  maxStudent: number;
  startDate: string;
  course?: { name: string };
  _count?: { studentGroups: number };
};

export default function Groups() {
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    groupsApi.list()
      .then((response) => setGroups(response.items as Group[]))
      .catch((requestError) => setError(requestError.message || "Guruhlarni yuklashda xatolik"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Guruhlar" subtitle={`${groups.length} ta guruh`} actionLabel="Yangi guruh" onAction={() => setOpen(true)} />
      {loading && <p className="mb-4 text-sm text-muted-foreground">Yuklanmoqda...</p>}
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {groups.map((group) => {
          const students = group._count?.studentGroups || 0;
          const pct = Math.min(100, Math.round((students / Math.max(group.maxStudent, 1)) * 100));
          return (
            <div key={group.id} className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:shadow-foreground/5 transition-all">
              <div className="flex items-start justify-between">
                <div><p className="font-heading font-bold text-lg">{group.name}</p><p className="text-sm text-muted-foreground">{group.course?.name || "—"}</p></div>
                <button className="p-1.5 rounded-lg hover:bg-muted"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1.5"><span className="flex items-center gap-1.5 text-muted-foreground"><Users2 className="w-4 h-4" />To'lganlik</span><span className="font-medium">{students}/{group.maxStudent}</span></div>
                <div className="h-2 rounded-full bg-muted overflow-hidden"><div className={`h-full rounded-full ${pct >= 90 ? "bg-amber-500" : pct >= 70 ? "bg-accent" : "bg-emerald-500"}`} style={{ width: `${pct}%` }} /></div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border"><span className="text-xs text-muted-foreground">Boshlanish: {new Date(group.startDate).toLocaleDateString("uz-UZ")}</span><StatusBadge status={group.status} /></div>
            </div>
          );
        })}
      </div>
      <AdminFormDrawer kind="group" open={open} onOpenChange={setOpen} />
    </div>
  );
}
