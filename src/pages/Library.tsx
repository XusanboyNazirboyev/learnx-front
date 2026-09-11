import React, { useState } from "react";
import { Search, BookOpen, Video, FileText, Presentation, Download } from "lucide-react";
// TODO: Replace mock library resources with API data before production.
import { libraryResources } from "@/lib/mockData";

const typeMeta = {
  BOOK: { label: "Kitob", icon: BookOpen },
  VIDEO: { label: "Video", icon: Video },
  PDF: { label: "PDF", icon: FileText },
  PRESENTATION: { label: "Prezentatsiya", icon: Presentation },
};

export default function Library() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Barchasi");

  const categories = ["Barchasi", ...new Set(libraryResources.map((r) => r.category))];

  const filtered = libraryResources.filter(
    (r) =>
      (category === "Barchasi" || r.category === category) &&
      (r.title.toLowerCase().includes(query.toLowerCase()) || r.author.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 h-10 px-3 rounded-xl bg-card border border-border flex-1">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Resurs nomi yoki muallif bo'yicha qidirish..."
            className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`h-10 px-4 rounded-xl text-sm font-medium border transition-colors ${category === c ? "navy-gradient text-white border-transparent" : "bg-card border-border hover:bg-muted"
                }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="bg-card rounded-2xl border border-border p-12 text-center">
          <BookOpen className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Hech narsa topilmadi — boshqa so'z bilan qidirib ko'ring</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((r) => {
          const meta = typeMeta[r.type];
          const Icon = meta.icon;
          return (
            <div key={r.id} className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:shadow-foreground/5 transition-all flex flex-col">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-muted text-muted-foreground">{meta.label}</span>
              </div>
              <p className="mt-4 font-heading font-bold leading-snug">{r.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{r.author}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
                <span className="px-2 py-0.5 rounded-md bg-muted">{r.category}</span>
                <span>{r.size}</span>
                <span>· {r.downloads} yuklab olingan</span>
              </div>
              <button className="mt-4 h-10 rounded-xl border border-border text-sm font-medium flex items-center justify-center gap-2 hover:bg-accent/10 hover:text-accent hover:border-accent/40 transition-colors">
                <Download className="w-4 h-4" />Yuklab olish
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}