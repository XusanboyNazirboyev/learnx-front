import { useEffect, useState, type FormEvent } from "react";
import { Phone, Mail } from "lucide-react";
import PageHeader, { type FilterOption } from "@/components/ui/PageHeader";
import EntityCard, { type StatusOption as CardStatusOption } from "@/components/ui/EntityCard";
import { StatusBadge } from "@/pages/admin/AdminDashboard";
import { adminsApi } from "@/api/services/adminsApi";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TablePagination from "@/components/ui/TablePagination";
import type { User } from "@/api/types";

const ADMIN_FILTER_OPTIONS: FilterOption[] = [
  { label: "Faol", value: "ACTIVE" },
  { label: "Nofaol", value: "INACTIVE" },
];

const ADMIN_STATUS_ACTIONS: CardStatusOption[] = [
  { value: "ACTIVE", label: "Faol", dot: "bg-emerald-500" },
  { value: "INACTIVE", label: "Nofaol", dot: "bg-slate-400" },
];

const EMPTY_FORM = { firstName: "", lastName: "", phone: "", email: "" };

export default function Admins() {
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [newCredentials, setNewCredentials] = useState<{ login: string; password: string } | null>(null);

  const fetchAdmins = () => {
    setLoading(true);
    adminsApi
      .list({ page, limit, status: statusFilter || undefined })
      .then((res) => {
        setAdmins(res.items as User[]);
        if (res.meta) { setTotal(res.meta.total); setTotalPages(res.meta.totalPages); }
      })
      .catch((err) => setError(err.message || "Adminlarni yuklashda xatolik"))
      .finally(() => setLoading(false));
  };

  useEffect(fetchAdmins, [page, limit, statusFilter]);

  const addAdmin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      const res = await adminsApi.create({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
      });
      if (res && res.credentials) setNewCredentials(res.credentials);
      setDrawerOpen(false);
      setForm(EMPTY_FORM);
      fetchAdmins();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Admin yaratishda xatolik");
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = (admin: User, status: string) => {
    adminsApi
      .setStatus(admin.id, status)
      .then(() => setAdmins((prev) => prev.map((a) => a.id === admin.id ? { ...a, status } : a)))
      .catch((err) => setError(err.message || "Statusni yangilashda xatolik"));
  };

  const deleteAdmin = (admin: User) => {
    adminsApi
      .remove(admin.id)
      .then(() => {
        setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
        setTotal((t) => Math.max(0, t - 1));
      })
      .catch((err) => setError(err.message || "O'chirishda xatolik"));
  };

  return (
    <div>
      <PageHeader
        title="Adminlar"
        subtitle={(total || admins.length) + " ta admin"}
        actionLabel="Yangi admin"
        onAction={() => setDrawerOpen(true)}
        filterOptions={ADMIN_FILTER_OPTIONS}
        filterValue={statusFilter}
        onFilterChange={(val) => { setStatusFilter(val); setPage(1); }}
      />

      {loading && <p className="mb-4 text-sm text-muted-foreground">Yuklanmoqda...</p>}
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {admins.map((a) => {
          const initials = ((a.firstName?.[0] || "") + (a.lastName?.[0] || "")).toUpperCase();
          return (
            <EntityCard
              key={a.id}
              avatarInitials={initials}
              avatarClass="bg-primary/10 text-primary"
              title={a.firstName + " " + a.lastName}
              subtitle={a.email || "—"}
              statusBadge={<StatusBadge status={a.status} />}
              details={[
                {
                  icon: <Phone className="w-3.5 h-3.5" />,
                  label: "Telefon",
                  value: a.phone,
                },
                {
                  icon: <Mail className="w-3.5 h-3.5" />,
                  label: "Email",
                  value: a.email || "—",
                },
              ]}
              statusOptions={ADMIN_STATUS_ACTIONS}
              currentStatus={a.status}
              onStatusChange={(s) => updateStatus(a, s)}
              onDelete={() => deleteAdmin(a)}
              deleteTitle={'"' + a.firstName + " " + a.lastName + '" ni o\'chirish'}
              deleteDescription="Ushbu adminni o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi."
            />
          );
        })}
      </div>

      {!loading && admins.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Hech qanday admin topilmadi.
        </p>
      )}

      <TablePagination
        page={page} totalPages={totalPages} total={total} limit={limit}
        onPageChange={setPage}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
      />

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="flex h-full w-full flex-col gap-0 p-0 sm:max-w-[420px]">
          <SheetHeader className="border-b border-border px-6 py-5 text-left">
            <SheetTitle className="font-heading text-xl font-bold">Yangi admin qo'shish</SheetTitle>
            <SheetDescription className="mt-1 text-sm">
              Yangi admin uchun ma'lumotlarni kiriting. Parol avtomatik yaratiladi va birinchi kirishda almashtirilishi so'raladi.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={addAdmin} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Ism</Label>
                <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="Ism" className="h-11 rounded-xl bg-muted/40 border-border" required minLength={2} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Familiya</Label>
                <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Familiya" className="h-11 rounded-xl bg-muted/40 border-border" required minLength={2} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Telefon raqam</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+998" className="h-11 rounded-xl bg-muted/40 border-border" required />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Elektron pochta (ixtiyoriy)</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@example.com" className="h-11 rounded-xl bg-muted/40 border-border" />
              </div>
            </div>
            <div className="border-t border-border px-6 py-4">
              {formError && <p className="mb-2 text-sm text-destructive">{formError}</p>}
              <Button type="submit" disabled={submitting} className="w-full h-11 rounded-xl font-semibold navy-gradient">
                {submitting ? "Saqlanmoqda..." : "Yaratish"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      <Dialog
        open={newCredentials !== null}
        onOpenChange={(o) => { if (!o) setNewCredentials(null); }}
      >
        <DialogContent className="sm:max-w-[400px] rounded-2xl border border-border bg-card p-6">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold">Admin yaratildi</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mt-1">
            Login va parolni adminga bering. Birinchi kirishda parolni almashtirish so'raladi.
          </p>
          <div className="mt-4 space-y-2 rounded-xl bg-muted/50 border border-border p-4 font-mono text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Login:</span>
              <span className="font-semibold">{newCredentials?.login}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Parol:</span>
              <span className="font-semibold">{newCredentials?.password}</span>
            </div>
          </div>
          <Button className="mt-4 w-full h-11 rounded-xl navy-gradient" onClick={() => setNewCredentials(null)}>Yopish</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
