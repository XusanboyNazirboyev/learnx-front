import { useState, type FormEvent } from "react";
import { apiClient } from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Loader2, Mail, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.request("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ identifier }),
      });
    } catch {
      // Hisob mavjud yoki yo'qligi oshkor bo'lmasligi kerak
    } finally {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-2xl navy-gradient flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <p className="font-heading font-bold text-xl">Learnix</p>
        </div>

        {sent ? (
          <div className="rounded-2xl border border-border bg-card p-6">
            <h1 className="font-heading font-bold text-2xl">Kod yuborildi</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Agar bu telefon yoki email bilan hisob mavjud bo'lsa, tiklash kodi yuborildi. Kod 5 daqiqa amal qiladi.
            </p>
            <a href="/reset-password" className="mt-6 flex items-center justify-center h-11 w-full rounded-xl accent-gradient text-white font-semibold">
              Kodni kiritish
            </a>
            <a href="/login" className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground justify-center">
              <ArrowLeft className="w-4 h-4" /> Kirish sahifasiga qaytish
            </a>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-6">
            <h1 className="font-heading font-bold text-2xl">Parolni tiklash</h1>
            <p className="mt-2 text-sm text-muted-foreground">Telefon raqamingiz yoki emailingizni kiriting — tiklash kodini yuboramiz.</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-sm font-medium">Telefon yoki email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
                  <Input
                    id="identifier"
                    type="text"
                    autoFocus
                    placeholder="+998901234567 yoki siz@example.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="pl-11 h-12 rounded-xl bg-muted/40 border-border"
                    required
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl font-semibold text-base navy-gradient">
                {loading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Yuborilmoqda...</>) : "Kod yuborish"}
              </Button>
              <a href="/login" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" /> Kirish sahifasiga qaytish
              </a>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
