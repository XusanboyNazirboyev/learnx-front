import React, { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { StatusBadge } from "@/pages/admin/AdminDashboard";
import { apiClient } from "@/api/apiClient";
import AdminFormDrawer from "@/components/admin/AdminFormDrawer";

type Teacher = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  status: string;
  teacherProfile?: {
    specialty?: string | null;
    salaryType?: string;
    salaryAmount?: number | string;
    _count?: { groupTeachers: number };
  };
};

const formatMoney = (value: number | string) => `${Number(value).toLocaleString("uz-UZ")} so'm`;
const salaryLabel: Record<string, string> = { FIXED: "Belgilangan", PERCENTAGE: "Foiz", HOURLY: "Soatlik" };

export default function Teachers() {
  const [open, setOpen] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient.request<{ items: Teacher[] }>("/teachers?limit=100")
      .then((response) => setTeachers(response.items))
      .catch((requestError) => setError(requestError.message || "O'qituvchilarni yuklashda xatolik"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="O'qituvchilar" subtitle={`${teachers.length} ta o'qituvchi`} actionLabel="Yangi o'qituvchi" onAction={() => setOpen(true)} />
      {loading && <p className="mb-4 text-sm text-muted-foreground">Yuklanmoqda...</p>}
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {teachers.map((teacher) => {
          const profile = teacher.teacherProfile;
          const salaryType = profile?.salaryType || "FIXED";
          const salary = profile?.salaryAmount || 0;
          return (
            <div key={teacher.id} className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:shadow-foreground/5 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl navy-gradient flex items-center justify-center text-white font-semibold">{teacher.firstName?.[0]}{teacher.lastName?.[0]}</div>
                  <div><p className="font-heading font-bold">{teacher.firstName} {teacher.lastName}</p><p className="text-sm text-muted-foreground">{profile?.specialty || "—"}</p></div>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-muted"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-border text-center">
                <div><p className="text-xs text-muted-foreground">Guruhlar</p><p className="font-heading font-bold mt-0.5">{profile?._count?.groupTeachers || 0}</p></div>
                <div><p className="text-xs text-muted-foreground">Maosh turi</p><p className="font-semibold text-xs mt-1">{salaryLabel[salaryType] || salaryType}</p></div>
                <div><p className="text-xs text-muted-foreground">Maosh</p><p className="font-heading font-bold mt-0.5 text-sm">{salaryType === "PERCENTAGE" ? `${salary}%` : formatMoney(salary)}</p></div>
              </div>
              <div className="flex items-center justify-between mt-4"><span className="text-xs text-muted-foreground">{teacher.phone}</span><StatusBadge status={teacher.status} /></div>
            </div>
          );
        })}
      </div>
      <AdminFormDrawer kind="teacher" open={open} onOpenChange={setOpen} />
    </div>
  );
}
