import React, { useEffect, useState } from "react";
import { Users2, DoorOpen, Trash2 } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { roomsApi, type Room } from "@/api/services/roomsApi";
import AdminFormDrawer from "@/components/admin/AdminFormDrawer";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Rooms() {
  const [roomList, setRoomList] = useState<Room[]>([]);
  const [open, setOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRooms = () => {
    setLoading(true);
    roomsApi.list()
      .then((response) => setRoomList(response.items))
      .catch((requestError) => setError(requestError.message || "Xonalarni yuklashda xatolik"))
      .finally(() => setLoading(false));
  };

  useEffect(loadRooms, []);

  const addRoom = (values: Record<string, string>) => {
    if (!values.name?.trim() || !values.capacity) return;
    roomsApi.create(values.name.trim(), Number(values.capacity))
      .then((room) => {
        setRoomList((current) => [room, ...current]);
      })
      .catch((requestError) => setError(requestError.message || "Xona yaratishda xatolik"));
  };

  const deleteRoom = () => {
    if (!roomToDelete) return;
    roomsApi.remove(roomToDelete.id)
      .then(() => setRoomList((current) => current.filter((room) => room.id !== roomToDelete.id)))
      .catch((requestError) => setError(requestError.message || "Xonani o'chirishda xatolik"))
      .finally(() => setRoomToDelete(null));
  };

  return (
    <div>
      <PageHeader title="Xonalar" subtitle={`${roomList.length} ta xona`} actionLabel="Yangi xona" onAction={() => setOpen(true)} />
      {loading && <p className="mb-4 text-sm text-muted-foreground">Yuklanmoqda...</p>}
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {roomList.map((room) => {
          const occupied = room._count?.schedules || 0;
          const pct = Math.min(100, Math.round((occupied / Math.max(room.capacity, 1)) * 100));
          const isActive = room.status === "ACTIVE";
          return (
            <div key={room.id} className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:shadow-foreground/5 transition-all">
              <div className="flex items-start justify-between"><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-xl navy-gradient flex items-center justify-center text-white"><DoorOpen className="w-5 h-5" /></div><div><p className="font-heading font-bold">{room.name}</p><p className="text-sm text-muted-foreground">O'quv xonasi</p></div></div><div className="flex items-center gap-2"><button type="button" aria-label={`${room.name} xonasini o'chirish`} onClick={() => setRoomToDelete(room)} className="rounded-lg p-2 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button><span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>{isActive ? "Faol" : "Nofaol"}</span></div></div>
              <div className="mt-4"><div className="flex items-center justify-between text-sm mb-1.5"><span className="flex items-center gap-1.5 text-muted-foreground"><Users2 className="w-4 h-4" />Jadval bandligi</span><span className="font-medium">{occupied}/{room.capacity}</span></div><div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} /></div></div>
            </div>
          );
        })}
      </div>
      <AdminFormDrawer kind="room" open={open} onOpenChange={setOpen} onSubmit={addRoom} />
      <Dialog open={Boolean(roomToDelete)} onOpenChange={(nextOpen) => !nextOpen && setRoomToDelete(null)}><DialogContent className="sm:max-w-sm"><DialogHeader><DialogTitle className="font-heading text-xl font-bold">Xonani o'chirish</DialogTitle></DialogHeader><p className="py-2 text-sm text-muted-foreground">Rostdan ham o'chirishni hohlaysizmi?</p><DialogFooter><Button variant="ghost" onClick={() => setRoomToDelete(null)}>Bekor qilish</Button><Button variant="destructive" onClick={deleteRoom}>Ha</Button></DialogFooter></DialogContent></Dialog>
    </div>
  );
}
