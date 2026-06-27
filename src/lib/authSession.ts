import axios from "axios";

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;
let handlingUnauthorized = false;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler;
}

export function handleUnauthorized() {
  if (handlingUnauthorized) return;
  handlingUnauthorized = true;
  unauthorizedHandler?.();
  window.setTimeout(() => {
    handlingUnauthorized = false;
  }, 1500);
}

export function isUnauthorizedError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401;
}

export function isPublicPortalApiPath(url?: string): boolean {
  if (!url) return false;
  return (
    url.includes("/vendor-portal/magic-link") ||
    url.includes("/vendor-portal/verify-magic-link")
  );
}
