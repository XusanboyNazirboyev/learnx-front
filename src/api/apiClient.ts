import type { User } from "./types";

const apiBaseUrl = (
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000/api"
).replace(/\/$/, "");

type ApiError = Error & { status?: number; data?: unknown };

let refreshPromise: Promise<boolean> | null = null;
const onUnauthorized: Array<() => void> = [];

export const setUnauthorizedHandler = (fn: () => void) => {
    onUnauthorized.push(fn);
};

const buildQuery = (query?: Record<string, string | number | undefined>) => {
    if (!query) return "";
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null && value !== "") {
            params.set(key, String(value));
        }
    }
    const s = params.toString();
    return s ? `?${s}` : "";
};

const rawRequest = async <T>(
    path: string,
    init: RequestInit = {},
): Promise<T> => {
    const headers = new Headers(init.headers);
    headers.set("Content-Type", "application/json");
    const token = localStorage.getItem("accessToken");
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const response = await fetch(`${apiBaseUrl}${path}`, {
        ...init,
        headers,
        credentials: "include",
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const error = new Error(
            typeof data?.message === "string" ? data.message : "Request failed",
        ) as ApiError;
        error.status = response.status;
        error.data = data;
        throw error;
    }
    if (
        data &&
        typeof data === "object" &&
        "success" in data &&
        data.success === true &&
        "data" in data
    ) {
        return data.data as T;
    }
    return data as T;
};

const clearTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};

const refreshTokens = async (): Promise<boolean> => {
    if (refreshPromise) return refreshPromise;
    refreshPromise = (async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) return false;
            const data = await rawRequest<{
                tokens: { accessToken: string; refreshToken: string };
            }>("/auth/refresh", {
                method: "POST",
                body: JSON.stringify({ refreshToken }),
            });
            localStorage.setItem("accessToken", data.tokens.accessToken);
            localStorage.setItem("refreshToken", data.tokens.refreshToken);
            return true;
        } catch {
            return false;
        } finally {
            refreshPromise = null;
        }
    })();
    return refreshPromise;
};

const request = async <T>(
    path: string,
    init: RequestInit = {},
    retry = true,
): Promise<T> => {
    try {
        return await rawRequest<T>(path, init);
    } catch (error) {
        const apiError = error as ApiError;
        if (
            retry &&
            apiError.status === 401 &&
            localStorage.getItem("refreshToken")
        ) {
            const refreshed = await refreshTokens();
            if (refreshed) return request<T>(path, init, false);
            clearTokens();
            onUnauthorized.forEach((fn) => fn());
        }
        throw error;
    }
};

export const apiClient = {
    request,
    buildQuery,
    async login(identifier: string, password: string) {
        const data = await request<{
            user: User;
            mustChangePassword: boolean;
            tokens: { accessToken: string; refreshToken: string };
        }>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ identifier, password }),
        });
        localStorage.setItem("accessToken", data.tokens.accessToken);
        localStorage.setItem("refreshToken", data.tokens.refreshToken);
        return { user: data.user, mustChangePassword: data.mustChangePassword };
    },
    me() {
        return request("/auth/me");
    },
    async logout(redirect = true) {
        const refreshToken = localStorage.getItem("refreshToken");
        try {
            if (refreshToken && localStorage.getItem("accessToken")) {
                await request("/auth/logout", {
                    method: "POST",
                    body: JSON.stringify({ refreshToken }),
                });
            }
        } finally {
            clearTokens();
            if (redirect) window.location.href = "/login";
        }
    },
    redirectToLogin() {
        window.location.href = "/login";
    },
    changePassword(oldPassword: string, newPassword: string) {
        return request("/auth/change-password", {
            method: "PATCH",
            body: JSON.stringify({ oldPassword, newPassword }),
        });
    },
    // Diqqat: bu yerda Content-Type ataylab o'rnatilmaydi — FormData yuborilganda
    // brauzerning o'zi to'g'ri "multipart/form-data; boundary=..." headerini qo'yishi kerak.
    // Agar uni qo'lda "application/json" qilib qo'ysak, server faylni o'qiy olmay qoladi.
    async uploadPhoto(file: File): Promise<User> {
        const formData = new FormData();
        formData.append("file", file);

        const headers = new Headers();
        const token = localStorage.getItem("accessToken");
        if (token) headers.set("Authorization", `Bearer ${token}`);

        const response = await fetch(`${apiBaseUrl}/users/me/photo`, {
            method: "POST",
            headers,
            body: formData,
            credentials: "include",
        });
        const data = await response.json().catch(() => null);

        if (!response.ok) {
            const error = new Error(
                typeof data?.message === "string" ? data.message : "Rasm yuklanmadi",
            ) as ApiError;
            error.status = response.status;
            error.data = data;
            throw error;
        }
        return data as User;
    },
    // Admin talaba/o'qituvchi yaratayotganda yoki tahrirlayotganda rasm tanlasa,
    // shu orqali yuklanadi — hech kimning User yozuviga bog'lanmaydi, faqat URL qaytadi.
    async uploadGenericPhoto(file: File): Promise<{ url: string }> {
        const formData = new FormData();
        formData.append("file", file);

        const headers = new Headers();
        const token = localStorage.getItem("accessToken");
        if (token) headers.set("Authorization", `Bearer ${token}`);

        const response = await fetch(`${apiBaseUrl}/uploads/photo`, {
            method: "POST",
            headers,
            body: formData,
            credentials: "include",
        });
        const data = await response.json().catch(() => null);

        if (!response.ok) {
            const error = new Error(
                typeof data?.message === "string" ? data.message : "Rasm yuklanmadi",
            ) as ApiError;
            error.status = response.status;
            error.data = data;
            throw error;
        }
        return data as { url: string };
    },
};
