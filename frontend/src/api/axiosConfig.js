import axios from "axios";

const api = axios.create({
  baseURL:
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("fraudguard_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.code;
    const requestUrl = error.config?.url || "";

    const isLoginRequest = requestUrl.includes("/auth/login");

    const sessionMustEnd =
      status === 401 ||
      code === "ACCOUNT_DISABLED" ||
      code === "USER_NOT_FOUND" ||
      code === "TOKEN_INVALID";

    if (sessionMustEnd && !isLoginRequest) {
      const message =
        error.response?.data?.message ||
        "Your session has ended. Please sign in again.";

      localStorage.removeItem("fraudguard_token");
      localStorage.removeItem("fraudguard_fullName");
      localStorage.removeItem("fraudguard_email");
      localStorage.removeItem("fraudguard_role");

      sessionStorage.setItem(
        "fraudguard_auth_message",
        message
      );

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;