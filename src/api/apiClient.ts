const apiBaseUrl = (
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:4000/api"
).replace(/\/$/, "");

type ApiError = Error & { status?: number; data?: unknown };

const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
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

export const apiClient = {
    request,
    async login(identifier: string, password: string) {
        const data = await request<{
            user: unknown;
            tokens: { accessToken: string; refreshToken: string };
        }>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ identifier, password }),
        });
        localStorage.setItem("accessToken", data.tokens.accessToken);
        localStorage.setItem("refreshToken", data.tokens.refreshToken);
        return data.user;
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
    requestPasswordReset() {
        return Promise.reject(
            new Error(
                "Password reset is not available in the current backend.",
            ),
        );
    },
};
