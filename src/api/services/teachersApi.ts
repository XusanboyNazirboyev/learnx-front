import { apiClient } from "../apiClient";
import type { Paginated, PaginationQuery, User } from "../types";

export const teachersApi = {
    list(query: PaginationQuery = {}) {
        return apiClient.request<Paginated<User>>(
            `/teachers${apiClient.buildQuery(query)}`,
        );
    },
    get(id: number) {
        return apiClient.request<User>(`/teachers/${id}`);
    },
};
