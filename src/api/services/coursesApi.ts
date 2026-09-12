import { apiClient } from "../apiClient";
import type { Paginated, PaginationQuery } from "../types";

export interface Course {
    id: number;
    name: string;
    price: number;
    durationMonth: number;
    durationHours: number;
    status: "ACTIVE" | "INACTIVE";
    _count?: { groups: number };
}

export const coursesApi = {
    list(query: PaginationQuery = {}) {
        return apiClient.request<Paginated<Course>>(
            `/courses${apiClient.buildQuery(query)}`,
        );
    },
};
