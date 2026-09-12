import { apiClient } from "../apiClient";
import type { DashboardReport } from "../types";

export const reportsApi = {
    dashboard() {
        return apiClient.request<DashboardReport>("/reports/dashboard");
    },
};
