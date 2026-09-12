import { apiClient } from "../apiClient";
import type { Paginated, PaginationQuery } from "../types";

export type Room = {
    id: number;
    name: string;
    capacity: number;
    status: string;
    _count?: { schedules: number };
};

export const roomsApi = {
    list(query: PaginationQuery = {}) {
        return apiClient.request<Paginated<Room>>(
            `/rooms?${new URLSearchParams(query as Record<string, string>)}`,
        );
    },
    create(name: string, capacity: number) {
        return apiClient.request<Room>("/rooms", {
            method: "POST",
            body: JSON.stringify({ name, capacity }),
        });
    },
    remove(id: number) {
        return apiClient.request<void>(`/rooms/${id}`, { method: "DELETE" });
    },
};
