const configuredApiBase = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");
const localApiBase = "http://localhost:5000/api";
const productionApiBase = "https://lumora-api-virid.vercel.app/api";
const isLocalApiBase =
  configuredApiBase &&
  /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?(?:\/|$)/i.test(
    configuredApiBase
  );
const API_BASE = import.meta.env.DEV
  ? configuredApiBase || localApiBase
  : configuredApiBase && !isLocalApiBase
    ? configuredApiBase
    : productionApiBase;

export async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}