const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export async function apiFetch<TResponse>(
  path: string,
  token: string,
  init: RequestInit = {}
): Promise<TResponse> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init.headers
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const body = await response.json().catch(() => undefined);
    throw new Error(body?.error?.message ?? "Request failed.");
  }

  return response.json() as Promise<TResponse>;
}
