import axios from "axios";
import { handleUnauthorized, isPublicPortalApiPath } from "@/lib/authSession";

const TOKEN_KEY = "@VendorPortal:token";

const API_BASE_URL = import.meta.env.VITE_APP_API || "/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = String(error.config?.url ?? "");

    if (status === 401 && !isPublicPortalApiPath(requestUrl)) {
      handleUnauthorized();
    }

    return Promise.reject(error);
  }
);

export { TOKEN_KEY };
