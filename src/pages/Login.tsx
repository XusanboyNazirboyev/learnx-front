import React, { useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, Loader2, GraduationCap, ArrowRight, ShieldCheck, Sparkles, BarChart3 } from "lucide-react";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const returnTo = safeReturnTo();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await apiClient.login(identifier, password) as { role?: string };
      const roleDashboard = user.role === "STUDENT"
        ? "/student"
        : user.role === "TEACHER"
          ? "/teacher"
          : "/admin";
      window.location.href = returnTo === "/" ? roleDashboard : returnTo;
    } catch (err) {
      setError(err.message || "Telefon, email yoki parol noto'g'ri");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: ShieldCheck, title: "Xavfsiz tizim", text: "Rol asosida kirish — admin, o'qituvchi, talaba" },
    { icon: BarChart3, title: "To'liq nazorat", text: "Davomat, to'lovlar va hisobotlar bir joyda" },
    { icon: Sparkles, title: "Aqlli avtomatika", text: "Dars jadvali va davomat avtomatik hisoblanadi" },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative navy-gradient text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, hsl(199 76% 56%) 0, transparent 40%), radial-gradient(circle at 80% 70%, hsl(262 52% 56%) 0, transparent 35%)" }} />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full accent-gradient opacity-20 blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-accent opacity-10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl accent-gradient flex items-center justify-center shadow-lg shadow-accent/40">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-heading font-bold text-xl leading-none">Learnix</p>
              <p className="text-xs text-white/50 mt-1 tracking-wider uppercase">ERP / CRM platforma</p>
            </div>
          </div>

          <div className="max-w-md">
            <h2 className="font-heading font-bold text-4xl xl:text-5xl leading-tight tracking-tight">
              Ta'lim markazi uchun <span className="bg-gradient-to-r from-accent to-cyan-300 bg-clip-text text-transparent">aqlli boshqaruv</span>
            </h2>
            <p className="mt-5 text-white/60 text-lg leading-relaxed">
              Talabalar, o'qituvchilar, guruhlar, to'lovlar va hisobotlar — barchasi yagona tizimda. Najot Ta'lim uslubidagi zamonaviy yondashuv.
            </p>

            <div className="mt-10 space-y-4">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 backdrop-blur-sm">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{f.title}</p>
                      <p className="text-sm text-white/50">{f.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-white/40">© 2026 Learnix. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-2xl navy-gradient flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <p className="font-heading font-bold text-xl">Learnix</p>
          </div>

          <div className="mb-8">
            <h1 className="font-heading font-bold text-3xl tracking-tight">Xush kelibsiz</h1>
            <p className="text-muted-foreground mt-2">Davom etish uchun tizimga kiring</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-sm font-medium">Telefon yoki email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
                <Input
                  id="identifier"
                  type="text"
                  autoComplete="username"
                  autoFocus
                  placeholder="+998901234567 yoki siz@example.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="pl-11 h-12 rounded-xl bg-muted/40 border-border"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Parol</Label>
                <Link to="/forgot-password" className="text-xs font-medium text-accent hover:underline">
                  Parolni unutdingiz?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 h-12 rounded-xl bg-muted/40 border-border"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                  title={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
              <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary" />
              Eslab qolish
            </label>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl font-semibold text-base navy-gradient hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Kirilmoqda...
                </>
              ) : (
                <>
                  Tizimga kirish
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </Button>
          </form>

        </div>
      </div>
    </div>
  );
}