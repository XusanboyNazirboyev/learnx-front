import React, { useState } from "react";
import { Search, LifeBuoy, Mail, Phone, MessageSquare } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { faqs } from "@/lib/mockData";

export default function HelpCenter() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Barchasi");

  const categories = ["Barchasi", ...new Set(faqs.map((f) => f.category))];

  const filtered = faqs.filter(
    (f) =>
      (category === "Barchasi" || f.category === category) &&
      (f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl accent-gradient text-white flex items-center justify-center">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg">Qanday yordam bera olamiz?</h3>
            <p className="text-sm text-muted-foreground">Tez-tez so'raladigan savollar bo'yicha qidiruv</p>
          </div>
        </div>
        <div className="flex items-center gap-2 h-11 px-3 rounded-xl bg-muted/40 border border-border">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Savolingizni yozing..."
            className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap mt-4">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`h-9 px-3.5 rounded-xl text-sm font-medium border transition-colors ${category === c ? "navy-gradient text-white border-transparent" : "bg-card border-border hover:bg-muted"
                }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Savol topilmadi — boshqa so'z bilan qidirib ko'ring yoki biz bilan bog'laning.</p>
        ) : (
          <Accordion type="single" collapsible className="divide-y divide-border">
            {filtered.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-b-0">
                <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                  <span className="flex items-center gap-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted text-muted-foreground">{f.category}</span>
                    {f.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-heading font-bold text-lg mb-1">Javob topilmadimi?</h3>
        <p className="text-sm text-muted-foreground mb-5">Support jamoasi ish kunlari 9:00–18:00 da javob beradi</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a href="mailto:support@learnix.uz" className="h-11 rounded-xl border border-border flex items-center justify-center gap-2 text-sm font-medium hover:bg-accent/10 hover:text-accent hover:border-accent/40 transition-colors">
            <Mail className="w-4 h-4" />Email yozish
          </a>
          <a href="tel:+998901234567" className="h-11 rounded-xl border border-border flex items-center justify-center gap-2 text-sm font-medium hover:bg-accent/10 hover:text-accent hover:border-accent/40 transition-colors">
            <Phone className="w-4 h-4" />Qo'ng'iroq qilish
          </a>
          <button className="h-11 rounded-xl border border-border flex items-center justify-center gap-2 text-sm font-medium hover:bg-accent/10 hover:text-accent hover:border-accent/40 transition-colors">
            <MessageSquare className="w-4 h-4" />Chatni boshlash
          </button>
        </div>
      </div>
    </div>
  );
}