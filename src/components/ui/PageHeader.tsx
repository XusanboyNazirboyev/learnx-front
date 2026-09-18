import React, { useState } from "react";
import { Plus, Search, Filter, Download, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type FilterOption = {
  label: string;
  value: string;
};

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  showActions?: boolean;
  filterOptions?: FilterOption[];
  filterValue?: string;
  onFilterChange?: (value: string) => void;
}

export default function PageHeader({
  title,
  subtitle,
  actionLabel = "Qo'shish",
  onAction,
  showActions = true,
  filterOptions,
  filterValue = "",
  onFilterChange,
}: PageHeaderProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  const isFiltered = filterValue !== "";
  const activeLabel = filterOptions?.find((o) => o.value === filterValue)?.label;

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

          {/* Filter knopkasi */}
          {filterOptions && filterOptions.length > 0 ? (
            <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className={`h-10 px-3 rounded-xl border flex items-center gap-2 text-sm font-medium transition-colors
                    ${
                      isFiltered
                        ? "bg-accent/10 border-accent/50 text-accent"
                        : "bg-card border-border hover:bg-muted text-foreground"
                    }`}
                >
                  <Filter className={`w-4 h-4 ${isFiltered ? "text-accent" : "text-muted-foreground"}`} />
                  <span className="hidden sm:inline">
                    {isFiltered ? activeLabel : "Filtr"}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="min-w-[200px] p-2 rounded-2xl border border-border bg-card shadow-xl space-y-1"
              >
                {/* Barchasi — filter tozalash */}
                <DropdownMenuItem
                  onClick={() => {
                    onFilterChange?.("");
                    setFilterOpen(false);
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-colors ${
                    !isFiltered
                      ? "bg-accent/10 text-accent font-semibold"
                      : "text-foreground hover:bg-muted/70 font-medium"
                  }`}
                >
                  <div className="w-4 flex items-center justify-center">
                    {!isFiltered && <Check className="w-4 h-4 text-accent" />}
                  </div>
                  <span>Barchasi</span>
                </DropdownMenuItem>

                {filterOptions.map((opt) => {
                  const isSelected = opt.value === filterValue;
                  return (
                    <DropdownMenuItem
                      key={opt.value}
                      onClick={() => {
                        onFilterChange?.(opt.value);
                        setFilterOpen(false);
                      }}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-colors ${
                        isSelected
                          ? "bg-accent/10 text-accent font-semibold"
                          : "text-foreground hover:bg-muted/70 font-medium"
                      }`}
                    >
                      <div className="w-4 flex items-center justify-center">
                        {isSelected && <Check className="w-4 h-4 text-accent" />}
                      </div>
                      <span>{opt.label}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button className="h-10 px-3 rounded-xl bg-card border border-border flex items-center gap-2 text-sm font-medium hover:bg-muted transition-colors">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="hidden sm:inline">Filtr</span>
            </button>
          )}

          <button className="h-10 px-3 rounded-xl bg-card border border-border flex items-center gap-2 text-sm font-medium hover:bg-muted transition-colors">
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">Eksport</span>
          </button>
          {actionLabel && (
            <button
              onClick={onAction}
              className="h-10 px-4 rounded-xl navy-gradient text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-md shadow-primary/20"
            >
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">{actionLabel}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
