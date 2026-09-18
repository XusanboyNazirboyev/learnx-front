import { useEffect, useState } from "react";
import { Users, Clock, CalendarDays, DollarSign } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import EntityCard, { type StatusOption as CardStatusOption } from "@/components/ui/EntityCard";
import { StatusBadge } from "@/pages/admin/AdminDashboard";
import { coursesApi, type Course } from "@/api/services/coursesApi";
import AdminFormDrawer from "@/components/admin/AdminFormDrawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TablePagination from "@/components/ui/TablePagination";
import type { FilterOption } from "@/components/ui/PageHeader";

const formatMoney = (value: number | string) =>
  `${Number(value).toLocaleString("uz-UZ")} so'm`;

const COURSE_STATUS_ACTIONS: CardStatusOption[] = [
  { value: "ACTIVE", label: "Faol", dot: "bg-emerald-500" },
  { value: "INACTIVE", label: "Nofaol", dot: "bg-slate-400" },
];

const COURSE_FILTER_OPTIONS: FilterOption[] = [
  { label: "Faol", value: "ACTIVE" },
  { label: "Nofaol", value: "INACTIVE" },
];

export default function Courses() {
  const [open, setOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // View modal
  const [viewCourse, setViewCourse] = useState<Course | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewId, setViewId] = useState<number | null>(null);

  const fetchCourses = () => {
    setLoading(true);
    coursesApi
      .list({ page, limit, status: statusFilter || undefined })
      .then((res) => {
        setCourses(res.items);
        if (res.meta) {
          setTotal(res.meta.total);
          setTotalPages(res.meta.totalPages);
        }
      })
      .catch((err: Error) => setError(err.message || "Kurslarni yuklashda xatolik"))
      .finally(() => setLoading(false));
  };

  useEffect(fetchCourses, [page, limit, statusFilter]);

  useEffect(() => {
    if (!viewId) return;
    setViewLoading(true);
    setViewCourse(null);
    coursesApi
      .get(viewId)
      .then((res) => setViewCourse(res))
      .catch(() => {})
      .finally(() => setViewLoading(false));
  }, [viewId]);

  const handleSubmit = async (values: Record<string, string>) => {
    setError("");
    if (editCourse) {
      await coursesApi.update(editCourse.id, {
        name: values.name?.trim(),
        description: values.description?.trim() || undefined,
        price: values.price ? Number(values.price) : undefined,
        durationMonth: values.durationMonth ? Number(values.durationMonth) : undefined,
        durationHours: values.durationHours ? Number(values.durationHours) : undefined,
      });
      fetchCourses();
      setEditCourse(null);
      return;
    }
    const course = await coursesApi.create({
      name: values.name.trim(),
      description: values.description?.trim() || undefined,
      price: Number(values.price),
      durationMonth: Number(values.durationMonth),
      durationHours: Number(values.durationHours),
    });
    setCourses((prev) => [course, ...prev]);
    setTotal((prev) => prev + 1);
  };

  const updateStatus = (course: Course, status: string) => {
    coursesApi
      .update(course.id, { status: status as "ACTIVE" | "INACTIVE" })
      .then(() =>
        setCourses((prev) =>
          prev.map((c) => (c.id === course.id ? { ...c, status: status as Course["status"] } : c))
        )
      )
      .catch((err: Error) => setError(err.message || "Statusni yangilashda xatolik"));
  };

  const deleteCourse = (course: Course) => {
    coursesApi
      .remove(course.id)
      .then(fetchCourses)
      .catch((err: Error) => setError(err.message || "Kursni o'chirishda xatolik"));
  };

  return (
    <div>
      <PageHeader
        title="Kurslar"
        subtitle={`${total || courses.length} ta kurs`}
        actionLabel="Yangi kurs"
        onAction={() => setOpen(true)}
        filterOptions={COURSE_FILTER_OPTIONS}
        filterValue={statusFilter}
        onFilterChange={(val) => { setStatusFilter(val); setPage(1); }}
      />

      {loading && <p className="mb-4 text-sm text-muted-foreground">Yuklanmoqda...</p>}
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {courses.map((c) => {
          const initials = c.name.slice(0, 2).toUpperCase();
          return (
            <EntityCard
              key={c.id}
              avatarInitials={initials}
              avatarClass="navy-gradient text-white"
              title={c.name}
              subtitle={c.description || "Tavsif yo'q"}
              statusBadge={<StatusBadge status={c.status} />}
              details={[
                {
                  icon: <DollarSign className="w-3.5 h-3.5" />,
                  label: "Narx",
                  value: formatMoney(c.price),
                },
                {
                  icon: <CalendarDays className="w-3.5 h-3.5" />,
                  label: "Davomiyligi",
                  value: `${c.durationMonth} oy`,
                },
                {
                  icon: <Clock className="w-3.5 h-3.5" />,
                  label: "Dars soati",
                  value: `${c.durationHours} soat`,
                },
                {
                  icon: <Users className="w-3.5 h-3.5" />,
                  label: "Guruhlar",
                  value: `${c._count?.groups || 0} ta`,
                },
              ]}
              statusOptions={COURSE_STATUS_ACTIONS}
              currentStatus={c.status}
              onView={() => setViewId(c.id)}
              onEdit={() => { setEditCourse(c); setOpen(true); }}
              onStatusChange={(s) => updateStatus(c, s)}
              onDelete={() => deleteCourse(c)}
              deleteTitle={`"${c.name}" kursini o'chirish`}
              deleteDescription="Ushbu kursni o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi."
            />
          );
        })}
      </div>

      {!loading && courses.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Hali kurslar mavjud emas. Yangi kurs qo'shing.
        </p>
      )}

      <TablePagination
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
      />

      <AdminFormDrawer
        kind="course"
        open={open}
        onOpenChange={(o) => { setOpen(o); if (!o) setEditCourse(null); }}
        onSubmit={handleSubmit}
        initialValues={
          editCourse
            ? {
                name: editCourse.name,
                description: editCourse.description || "",
                price: String(editCourse.price),
                durationMonth: String(editCourse.durationMonth),
                durationHours: String(editCourse.durationHours),
              }
            : undefined
        }
      />

      {/* View Modal */}
      <Dialog
        open={viewId !== null}
        onOpenChange={(o) => { if (!o) { setViewId(null); setViewCourse(null); } }}
      >
        <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden rounded-2xl border border-border bg-card">
          <DialogHeader className="px-6 pt-5 pb-4 border-b border-border">
            <DialogTitle className="font-heading text-lg font-bold">
              Kurs ma'lumotlari
            </DialogTitle>
          </DialogHeader>

          {viewLoading && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Yuklanmoqda...
            </div>
          )}

          {viewCourse && (
            <div className="p-6 space-y-5">
              {/* Icon + name + status */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl navy-gradient flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {viewCourse.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-xl leading-tight">
                    {viewCourse.name}
                  </h3>
                  {viewCourse.description && (
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                      {viewCourse.description}
                    </p>
                  )}
                </div>
                <StatusBadge status={viewCourse.status} />
              </div>

              <div className="space-y-3 text-sm">
                {[
                  { label: "Narx", value: formatMoney(viewCourse.price) },
                  { label: "Davomiyligi", value: `${viewCourse.durationMonth} oy` },
                  { label: "Dars soati", value: `${viewCourse.durationHours} soat` },
                  { label: "Guruhlar soni", value: `${viewCourse._count?.groups || 0} ta` },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium text-foreground">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  className="rounded-xl px-5 h-10"
                  onClick={() => { setViewId(null); setViewCourse(null); }}
                >
                  Yopish
                </Button>
                <Button
                  className="rounded-xl px-5 h-10 navy-gradient text-white hover:opacity-90 shadow-sm shadow-primary/20"
                  onClick={() => {
                    const c = viewCourse;
                    setViewId(null);
                    setViewCourse(null);
                    if (c) setEditCourse(c);
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
    </div>
  );
}
