import { apiClient } from "../apiClient";

export const homeworkApi = {
    list(groupId?: number, lessonId?: number) {
        const query = new URLSearchParams();
        if (groupId) query.set("groupId", String(groupId));
        if (lessonId) query.set("lessonId", String(lessonId));
        return apiClient.request(`/homework?${query}`);
    },
    submit(homeworkId: number, content?: string, fileUrl?: string) {
        return apiClient.request("/submissions", {
            method: "POST",
            body: JSON.stringify({ homeworkId, content, fileUrl }),
        });
    },
    mySubmissions() {
        return apiClient.request("/submissions/my");
    },
};
