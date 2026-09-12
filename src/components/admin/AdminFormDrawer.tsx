import { useState } from "react";
import { Plus } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type AdminDrawerKind = "course" | "room" | "teacher" | "group";

type AdminFormDrawerProps = {
  kind: AdminDrawerKind;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (values: Record<string, string>) => void | Promise<void>;
};

const drawerContent = {
  course: { title: "Kurs qo'shish", description: "Bu yerda siz yangi kurs qo'shishingiz mumkin." },
  room: { title: "Xonani qo'shish", description: "Yangi xona yaratish uchun quyidagi ma'lumotlarni kiriting." },
  teacher: { title: "O'qituvchi qo'shish", description: "Bu yerda siz yangi o'qituvchi qo'shishingiz mumkin." },
  group: { title: "Guruh qo'shish", description: "Yangi guruh yaratish uchun quyidagi ma'lumotlarni kiriting." },
};

export default function AdminFormDrawer({ kind, open, onOpenChange, onSubmit }: AdminFormDrawerProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const content = drawerContent[kind];
  const update = (name: string, value: string) => setValues((current) => ({ ...current, [name]: value }));
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit?.(values);
    onOpenChange(false);
    setValues({});
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex h-full w-full flex-col gap-0 p-0 sm:max-w-[420px]">
        <SheetHeader className="border-b border-border px-6 py-5 text-left">
          <SheetTitle className="font-heading text-xl font-bold">{content.title}</SheetTitle>
          <SheetDescription className="mt-1 text-sm">{content.description}</SheetDescription>
        </SheetHeader>
        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
            {kind === "course" && <>
              <Field label="Nomi" name="name" placeholder="Kurs nomi" values={values} update={update} required />
              <Field label="Dars davomiyligi" name="durationHours" placeholder="Masalan: 60" values={values} update={update} type="number" required />
              <Field label="Kurs davomiyligi (oylarda)" name="durationMonth" placeholder="Masalan: 6" values={values} update={update} type="number" required />
              <Field label="Narx" name="price" placeholder="Narxni kiriting" values={values} update={update} type="number" required />
              <TextArea label="Description" name="description" placeholder="Kurs haqida qisqacha ma'lumot" values={values} update={update} />
            </>}
            {kind === "room" && <>
              <Field label="Nomi" name="name" placeholder="Xona nomi" values={values} update={update} required />
              <Field label="Sig'imi" name="capacity" placeholder="Masalan: 20" values={values} update={update} type="number" required />
            </>}
            {kind === "teacher" && <>
              <Field label="Telefon raqam" name="phone" placeholder="+998" values={values} update={update} required />
              <Field label="Mail" name="email" placeholder="Elektron pochtani kiriting" values={values} update={update} type="email" required />
              <Field label="O'qituvchi FIO" name="name" placeholder="Ma'lumotni kiriting" values={values} update={update} required />
              <SelectField label="Guruh" name="group" placeholder="Guruh tanlang" values={values} update={update} />
              <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground"><p className="font-medium text-primary">Rasm yuklash</p><p className="mt-1 text-xs">JPG yoki PNG (max. 800x800px)</p></div>
              <Field label="Manzil" name="address" placeholder="Manzilni kiriting" values={values} update={update} />
              <Field label="Parol" name="password" placeholder="Parolni kiriting" values={values} update={update} type="password" required />
            </>}
            {kind === "group" && <>
              <Field label="Guruh nomi" name="name" placeholder="Frontend 2024" values={values} update={update} required />
              <SelectField label="Kurs" name="course" placeholder="Kurs tanlang" values={values} update={update} required />
              <SelectField label="Xona" name="room" placeholder="Xona tanlang" values={values} update={update} required />
              <div className="space-y-2"><Label>Dars kunlari <span className="text-destructive">*</span></Label><div className="grid grid-cols-2 gap-2">{["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba", "Yakshanba"].map((day) => <label key={day} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"><input type="checkbox" name="days" value={day} />{day}</label>)}</div></div>
              <Field label="Dars vaqti" name="time" placeholder="09:00" values={values} update={update} type="time" required />
              <Field label="Boshlanish sanasi" name="startDate" placeholder="dd/mm/yyyy" values={values} update={update} type="date" required />
              <TextArea label="Tavsif" name="description" placeholder="Guruh haqida qo'shimcha ma'lumot" values={values} update={update} />
              <SelectField label="O'qituvchilar" name="teachers" placeholder="O'qituvchi qo'shish" values={values} update={update} />
              <SelectField label="Talabalar" name="students" placeholder="Talaba qo'shish" values={values} update={update} />
            </>}
          </div>
          <div className="flex justify-end gap-3 border-t border-border px-6 py-4"><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Bekor qilish</Button><Button type="submit" className="accent-gradient text-white hover:opacity-90"><Plus />Saqlash</Button></div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

type FieldProps = { label: string; name: string; placeholder: string; values: Record<string, string>; update: (name: string, value: string) => void; type?: string; required?: boolean };
function Field({ label, name, placeholder, values, update, type = "text", required }: FieldProps) {
  return <div className="space-y-2"><Label htmlFor={`admin-${name}`}>{label}{required && <span className="text-destructive"> *</span>}</Label><Input id={`admin-${name}`} name={name} type={type} placeholder={placeholder} value={values[name] || ""} onChange={(event) => update(name, event.target.value)} required={required} /></div>;
}

function TextArea({ label, name, placeholder, values, update }: Omit<FieldProps, "type" | "required">) {
  return <div className="space-y-2"><Label htmlFor={`admin-${name}`}>{label}</Label><textarea id={`admin-${name}`} name={name} placeholder={placeholder} value={values[name] || ""} onChange={(event) => update(name, event.target.value)} className="min-h-24 w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring" /></div>;
}

function SelectField({ label, name, placeholder, values, update, required }: FieldProps) {
  return <div className="space-y-2"><Label htmlFor={`admin-${name}`}>{label}{required && <span className="text-destructive"> *</span>}</Label><select id={`admin-${name}`} name={name} value={values[name] || ""} onChange={(event) => update(name, event.target.value)} required={required} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"><option value="">{placeholder}</option><option value="sample">Tanlash uchun ma'lumot yo'q</option></select></div>;
}