import { apiClient } from "../apiClient";
import type { Paginated, PaginationQuery } from "../types";

export interface Exam {
    id: number;
    title: string;
    scheduledAt: string;
    status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
    group: { id: number; name: string };
    _count?: { results: number };
}

export interface ExamResult {
    id: number;
    studentId: number;
    score: number | null;
    grade: number | null;
    status: "PENDING" | "PASS" | "REVISE" | "FAIL";
    student: { user: { firstName: string; lastName: string } };
}

export const examsApi = {
    list(query: PaginationQuery & { groupId?: number } = {}) {
        return apiClient.request<Paginated<Exam>>(
            `/exams${apiClient.buildQuery(query)}`,
        );
    },
    get(id: number) {
        return apiClient.request<Exam & { results: ExamResult[] }>(
            `/exams/${id}`,
        );
    },
    create(input: { title: string; groupId: number; scheduledAt: string }) {
        return apiClient.request<Exam>("/exams", {
            method: "POST",
            body: JSON.stringify(input),
        });
    },
    submitResults(
        id: number,
        items: Array<{ studentId: number; score?: number; grade?: number }>,
    ) {
        return apiClient.request<Exam>(`/exams/${id}/results`, {
            method: "POST",
            body: JSON.stringify({ items }),
        });
    },
};
