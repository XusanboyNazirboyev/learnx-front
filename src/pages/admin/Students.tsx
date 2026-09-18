import React, { useEffect, useState } from "react";
import { Phone, Mail, MapPin, CreditCard } from "lucide-react";
import PageHeader, { type FilterOption } from "@/components/ui/PageHeader";
import EntityCard, { type StatusOption as CardStatusOption } from "@/components/ui/EntityCard";
import { StatusBadge } from "@/pages/admin/AdminDashboard";
import { studentsApi } from "@/api/services/studentsApi";
import AdminFormDrawer from "@/components/admin/AdminFormDrawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TablePagination from "@/components/ui/TablePagination";

type Student = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
  status: string;
  photo?: string | null;
  address?: string | null;
  createdAt?: string;
  studentProfile?: {
    birthDate?: string | null;
    parentPhone?: string | null;
    balance?: number | string;
    studentGroups?: Array<{ group?: { name: string } }>;
  };
};

const STUDENT_FILTER_OPTIONS: FilterOption[] = [
  { label: "Faol", value: "ACTIVE" },
  { label: "Nofaol", value: "INACTIVE" },
];

const STUDENT_STATUS_ACTIONS: CardStatusOption[] = [
  { value: "ACTIVE", label: "Faol", dot: "bg-emerald-500" },
  { value: "INACTIVE", label: "Nofaol", dot: "bg-slate-400" },
];

const formatMoney = (v: number | string) =>
  `${Number(v).toLocaleString("uz-UZ")} so'm`;

const formatDate = (d?: string | null) => {
  if (!d) return "—";
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2, "0")}.${String(dt.getMonth() + 1).padStart(2, "0")}.${dt.getFullYear()}`;
};

export default function Students() {
  const [open, setOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newCredentials, setNewCredentials] = useState<{ login: string; password: string } | null>(null);

  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // View modal
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewId, setViewId] = useState<number | null>(null);

  const fetchStudents = () => {
    setLoading(true);
    studentsApi
      .list({ page, limit, status: statusFilter || undefined })
      .then((res) => {
        setStudents(res.items as Student[]);
        if (res.meta) { setTotal(res.meta.total); setTotalPages(res.meta.totalPages); }
      })
      .catch((err) => setError(err.message || "Talabalarni yuklashda xatolik"))
      .finally(() => setLoading(false));
  };

  useEffect(fetchStudents, [page, limit, statusFilter]);

  useEffect(() => {
    if (!viewId) return;
    setViewLoading(true);
    setViewStudent(null);
    studentsApi.get(viewId)
      .then((res) => setViewStudent(res as Student))
      .catch(() => {})
      .finally(() => setViewLoading(false));
  }, [viewId]);

  const addStudent = async (values: Record<string, string>) => {
    setError("");
    if (editStudent) {
      await studentsApi.update(editStudent.id, {
        firstName: values.firstName?.trim(),
        lastName: values.lastName?.trim(),
        phone: values.phone?.trim(),
        email: values.email?.trim() || undefined,
        address: values.address?.trim() || undefined,
      });
      fetchStudents();
      setEditStudent(null);
      return;
    }
    const res = await studentsApi.create({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      phone: values.phone.trim(),
      email: values.email?.trim() || undefined,
      birthDate: values.birthDate || undefined,
      parentPhone: values.parentPhone?.trim() || undefined,
      address: values.address?.trim() || undefined,
      photo: values.photo || undefined,
      groupIds: values.groupIds
        ? values.groupIds.split(",").filter(Boolean)
        : undefined,
      password: values.password?.trim() || undefined,
    });
    fetchStudents();
    setNewCredentials(res.credentials);
  };

  const updateStatus = (student: Student, status: string) => {
    studentsApi
      .update(student.id, { status })
      .then(() => setStudents((prev) => prev.map((s) => s.id === student.id ? { ...s, status } : s)))
      .catch((err) => setError(err.message || "Statusni yangilashda xatolik"));
  };

  const deleteStudent = (student: Student) => {
    studentsApi
      .remove(student.id)
      .then(fetchStudents)
      .catch((err) => setError(err.message || "Talabani o'chirishda xatolik"));
  };

  return (
    <div>
      <PageHeader
        title="Talabalar"
        subtitle={`${total || students.length} ta talaba`}
        actionLabel="Yangi talaba"
        onAction={() => setOpen(true)}
        filterOptions={STUDENT_FILTER_OPTIONS}
        filterValue={statusFilter}
        onFilterChange={(val) => { setStatusFilter(val); setPage(1); }}
      />

      {loading && <p className="mb-4 text-sm text-muted-foreground">Yuklanmoqda...</p>}
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {students.map((student) => {
          const group = student.studentProfile?.studentGroups?.[0]?.group?.name || "Guruh biriktirilmagan";
          const balance = student.studentProfile?.balance || 0;
          const initials = `${student.firstName?.[0] || ""}${student.lastName?.[0] || ""}`.toUpperCase();
          return (
            <EntityCard
              key={student.id}
              avatar={student.photo}
              avatarInitials={initials}
              avatarClass="bg-primary/10 text-primary"
              title={`${student.firstName} ${student.lastName}`}
              subtitle={group}
              statusBadge={<StatusBadge status={student.status} />}
              details={[
                {
                  icon: <Phone className="w-3.5 h-3.5" />,
                  label: "Telefon",
                  value: student.phone,
                },
                {
                  icon: <CreditCard className="w-3.5 h-3.5" />,
                  label: "Balans",
                  value: Number(balance) > 0
                    ? <span className="text-amber-600 font-semibold">{formatMoney(balance)}</span>
                    : <span className="text-emerald-600 font-semibold">To'langan</span>,
                },
              ]}
              statusOptions={STUDENT_STATUS_ACTIONS}
              currentStatus={student.status}
              onView={() => setViewId(student.id)}
              onEdit={() => { setEditStudent(student); setOpen(true); }}
              onStatusChange={(s) => updateStatus(student, s)}
              onDelete={() => deleteStudent(student)}
              deleteTitle={`"${student.firstName} ${student.lastName}" ni o'chirish`}
              deleteDescription="Ushbu talabani o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi."
            />
          );
        })}
      </div>

      {!loading && students.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Hech qanday talaba topilmadi.
        </p>
      )}

      <TablePagination
        page={page} totalPages={totalPages} total={total} limit={limit}
        onPageChange={setPage}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
      />

      <AdminFormDrawer
        kind="student"
        open={open}
        onOpenChange={(o) => { setOpen(o); if (!o) setEditStudent(null); }}
        onSubmit={addStudent}
        initialValues={editStudent ? {
          firstName: editStudent.firstName,
          lastName: editStudent.lastName,
          phone: editStudent.phone,
          email: editStudent.email || "",
          address: editStudent.address || "",
          birthDate: editStudent.studentProfile?.birthDate?.slice(0, 10) || "",
          parentPhone: editStudent.studentProfile?.parentPhone || "",
          photo: editStudent.photo || "",
        } : undefined}
      />

      {/* View Modal */}
      <Dialog
        open={viewId !== null}
        onOpenChange={(o) => { if (!o) { setViewId(null); setViewStudent(null); } }}
      >
        <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden rounded-2xl border border-border bg-card">
          <DialogHeader className="px-6 pt-5 pb-4 border-b border-border">
            <DialogTitle className="font-heading text-lg font-bold">
              Umumiy ma'lumot
            </DialogTitle>
          </DialogHeader>

          {viewLoading && (
            <div className="p-8 text-center text-sm text-muted-foreground">Yuklanmoqda...</div>
          )}

          {viewStudent && (
            <div className="p-6 space-y-5">
              {/* Avatar + name + status */}
              <div className="flex items-center gap-4">
                {viewStudent.photo ? (
                  <img src={viewStudent.photo} alt={viewStudent.firstName} className="w-14 h-14 rounded-xl object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                    {`${viewStudent.firstName?.[0] || ""}${viewStudent.lastName?.[0] || ""}`.toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-xl">
                    {viewStudent.firstName} {viewStudent.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {viewStudent.studentProfile?.studentGroups?.[0]?.group?.name || "Guruh biriktirilmagan"}
                  </p>
                </div>
                <StatusBadge status={viewStudent.status} />
              </div>

              <div className="space-y-3 text-sm">
                {[
                  { label: "Elektron pochta", value: viewStudent.email || "—" },
                  { label: "Telefon", value: viewStudent.phone || "—" },
                  { label: "Tug'ilgan sanasi", value: formatDate(viewStudent.studentProfile?.birthDate) },
                  { label: "Manzil", value: viewStudent.address || "—" },
                  { label: "Yaratilgan sanasi", value: formatDate(viewStudent.createdAt) },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium text-foreground">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button variant="outline" className="rounded-xl px-5 h-10" onClick={() => { setViewId(null); setViewStudent(null); }}>
                  Yopish
                </Button>
                <Button
                  className="rounded-xl px-5 h-10 navy-gradient text-white hover:opacity-90 shadow-sm shadow-primary/20"
                  onClick={() => {
                    const s = viewStudent;
                    setViewId(null); setViewStudent(null);
                    if (s) setEditStudent(s);
                    setOpen(true);
                  }}
                >
                  O'zgartirish
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Credentials Dialog */}
      <Dialog open={!!newCredentials} onOpenChange={(o) => !o && setNewCredentials(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl font-bold">
              Talaba muvaffaqiyatli qo'shildi
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Quyidagi login va parolni talabaga taqdim eting.
          </p>
          {newCredentials && (
            <div className="space-y-2 rounded-xl bg-muted p-4 text-sm">
              <p><span className="text-muted-foreground">Login:</span> <strong>{newCredentials.login}</strong></p>
              <p><span className="text-muted-foreground">Parol:</span> <strong>{newCredentials.password}</strong></p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
