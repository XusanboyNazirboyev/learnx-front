import { apiClient } from "../apiClient";
import type { Group, PaginationQuery, Paginated } from "../types";

export const groupsApi = {
    list(query: PaginationQuery = {}) {
        return apiClient.request<Paginated<Group>>(
            `/groups${apiClient.buildQuery(query)}`,
        );
    },
};
