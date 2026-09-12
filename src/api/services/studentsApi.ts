import { apiClient } from "../apiClient";
import type { PaginationQuery, Paginated, User } from "../types";

export const studentsApi = {
    list(query: PaginationQuery = {}) {
        return apiClient.request<Paginated<User>>(
            `/students?${new URLSearchParams(query as Record<string, string>)}`,
        );
    },
    get(id: number) {
        return apiClient.request<User>(`/students/${id}`);
    },
    addToGroup(studentId: number, groupId: number) {
        return apiClient.request(`/students/${studentId}/groups/${groupId}`, {
            method: "POST",
        });
    },
};
