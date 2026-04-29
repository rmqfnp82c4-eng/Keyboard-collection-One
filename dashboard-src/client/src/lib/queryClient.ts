import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getStaticData } from "./staticData";

// Static mode: no backend needed — all data is embedded in the bundle.
// When served by Vite dev server or Express, the backend is available.
// When served as a static file (GitHub Pages), there's no backend.
const STATIC_MODE = typeof window !== "undefined" && window.location.protocol === "file:"
  || (typeof window !== "undefined" && !window.location.port && window.location.hostname.includes("github.io"));

const API_BASE = "__PORT_5000__".startsWith("__") ? "" : "__PORT_5000__";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  if (STATIC_MODE) {
    // In static mode, return the data as a fake Response
    const staticResult = getStaticData(url);
    if (staticResult !== undefined) {
      return new Response(JSON.stringify(staticResult), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    // For POST mutations (like marking used), just return success
    if (method === "POST") {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  const res = await fetch(`${API_BASE}${url}`, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const key = queryKey.join("/");

    // In static mode, return embedded data directly
    if (STATIC_MODE) {
      const data = getStaticData(key);
      if (data !== undefined) return data as T;
    }

    const res = await fetch(`${API_BASE}${key}`);

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
