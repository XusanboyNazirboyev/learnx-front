import React, { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { StatusBadge } from "@/pages/admin/AdminDashboard";
import { studentsApi } from "@/api/services/studentsApi";

type Student = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
  status: string;
  studentProfile?: {
    balance?: number | string;
    studentGroups?: Array<{ group?: { name: string } }>;
  };
};

const formatMoney = (value: number | string) => `${Number(value).toLocaleString("uz-UZ")} so'm`;

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    studentsApi.list()
      .then((response) => setStudents(response.items as Student[]))
      .catch((requestError) => setError(requestError.message || "Talabalarni yuklashda xatolik"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Talabalar" subtitle={`${students.length} ta talaba ro'yxatdan o'tgan`} actionLabel="Yangi talaba" />
      {loading && <p className="mb-4 text-sm text-muted-foreground">Yuklanmoqda...</p>}
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-6 py-3.5">Talaba</th>
                <th className="text-left font-medium px-6 py-3.5">Guruh</th>
                <th className="text-left font-medium px-6 py-3.5">Telefon</th>
                <th className="text-left font-medium px-6 py-3.5">Email</th>
                <th className="text-left font-medium px-6 py-3.5">Balans</th>
                <th className="text-left font-medium px-6 py-3.5">Holat</th>
                <th className="px-6 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {students.map((student) => {
                const group = student.studentProfile?.studentGroups?.[0]?.group?.name || "—";
                const balance = student.studentProfile?.balance || 0;
                return (
                  <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg navy-gradient flex items-center justify-center text-white text-xs font-semibold">{student.firstName?.[0]}{student.lastName?.[0]}</div>
                        <div><p className="font-medium">{student.firstName} {student.lastName}</p><p className="text-xs text-muted-foreground">ID: {student.id}</p></div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">{group}</td>
                    <td className="px-6 py-3.5 text-muted-foreground">{student.phone}</td>
                    <td className="px-6 py-3.5 text-muted-foreground">{student.email || "—"}</td>
                    <td className="px-6 py-3.5 font-medium">{Number(balance) > 0 ? <span className="text-amber-600">{formatMoney(balance)}</span> : <span className="text-emerald-600">To'langan</span>}</td>
                    <td className="px-6 py-3.5"><StatusBadge status={student.status} /></td>
                    <td className="px-6 py-3.5"><button className="p-1.5 rounded-lg hover:bg-muted"><MoreHorizontal className="w-4 h-4" /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
