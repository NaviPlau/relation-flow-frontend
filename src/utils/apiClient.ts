const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

const TENANT_SLUG = "sprintwave-digital";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function apiRequest<T>(
  path: string,
  method: HttpMethod = "GET",
  body?: unknown
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-Tenant": TENANT_SLUG,
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

 if (!res.ok) {
  let message = `API ${method} ${path} failed: ${res.status}`;

  try {
    const data = await res.json();
    // DRF-Standard: { "detail": "..." }
    if (data) {
      message = data.detail;
    }
  } catch (err) {}

  throw new Error(message);
}

  if (res.status === 204) return undefined as T;

  return (await res.json()) as T;
}

export function apiGet<T>(path: string) {
  return apiRequest<T>(path, "GET");
}

export function apiPost<T>(path: string, body: unknown) {
  return apiRequest<T>(path, "POST", body);
}

export function apiPut<T>(path: string, body: unknown) {
  return apiRequest<T>(path, "PUT", body);
}

export function apiDelete<T>(path: string) {
  return apiRequest<T>(path, "DELETE");
}