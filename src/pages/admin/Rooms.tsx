import React, { useState } from "react";
import { Users2, DoorOpen } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// TODO: Replace mock rooms with API data before production.
import { rooms as initialRooms } from "@/lib/mockData";

const statusMap = {
  OCCUPIED: { label: "Band", cls: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  FREE: { label: "Bo'sh", cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  MAINTENANCE: { label: "Ta'mirda", cls: "bg-red-500/10 text-red-600 dark:text-red-400" },
};

export default function Rooms() {
  const [roomList, setRoomList] = useState(initialRooms);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");

  const addRoom = () => {
    if (!name.trim() || !capacity) return;
    setRoomList([
      { id: Date.now(), name: name.trim(), capacity: Number(capacity), occupied: 0, status: "FREE", type: "Oddiy sinf" },
      ...roomList,
    ]);
    setName("");
    setCapacity("");
    setOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Xonalar"
        subtitle={`${roomList.length} ta xona`}
        actionLabel="Yangi xona"
        onAction={() => setOpen(true)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {roomList.map((r) => {
          const pct = Math.min(100, Math.round((r.occupied / r.capacity) * 100));
          const status = statusMap[r.status];
          return (
            <div key={r.id} className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:shadow-foreground/5 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl navy-gradient flex items-center justify-center text-white">
                    <DoorOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-heading font-bold">{r.name}</p>
                    <p className="text-sm text-muted-foreground">{r.type}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${status.cls}`}>{status.label}</span>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><Users2 className="w-4 h-4" />Bandlik</span>
                  <span className="font-medium">{r.occupied}/{r.capacity}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${r.status === "MAINTENANCE" ? "bg-red-500" : pct >= 100 ? "bg-amber-500" : pct >= 60 ? "bg-accent" : "bg-emerald-500"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading font-bold text-lg">Yangi xona qo'shish</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="room-name">Xona nomi</Label>
              <Input id="room-name" placeholder="Masalan: Xona-D1" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="room-capacity">Sig'im (o'rin soni)</Label>
              <Input id="room-capacity" type="number" min="1" placeholder="Masalan: 20" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Bekor qilish</Button>
            <Button onClick={addRoom} disabled={!name.trim() || !capacity} className="navy-gradient hover:opacity-90">Qo'shish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}