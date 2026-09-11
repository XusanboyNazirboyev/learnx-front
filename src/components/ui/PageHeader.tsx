import React from "react";
import { Plus, Search, Filter, Download } from "lucide-react";

export default function PageHeader({ title, subtitle, actionLabel = "Qo'shish", onAction, showActions = true }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="font-heading font-bold text-2xl tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {showActions && (
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 h-10 px-3 rounded-xl bg-card border border-border">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input placeholder="Qidirish..." className="bg-transparent text-sm outline-none w-40" />
          </div>
          <button className="h-10 px-3 rounded-xl bg-card border border-border flex items-center gap-2 text-sm font-medium hover:bg-muted transition-colors">
            <Filter className="w-4 h-4" /> <span className="hidden sm:inline">Filtr</span>
          </button>
          <button className="h-10 px-3 rounded-xl bg-card border border-border flex items-center gap-2 text-sm font-medium hover:bg-muted transition-colors">
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">Eksport</span>
          </button>
          {actionLabel && (
            <button onClick={onAction} className="h-10 px-4 rounded-xl navy-gradient text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-md shadow-primary/20">
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">{actionLabel}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}