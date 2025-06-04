import { cookies } from "next/headers";
import { HttpMethod } from "../enums/HttpMethods";

export interface FetchOptions {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  auth?: boolean;
  revalidate?: number | false;
  cache?: RequestCache;
}

export interface FetcherConfig {
  baseUrl: string;
  tokenPath?: string;
  onUnauthorized?: () => void | Promise<void>;
}

async function internalFetch(
  url: string,
  options: FetchOptions,
  tokenPath: string,
  onUnauthorized?: () => void | Promise<void>
): Promise<Response> {
    
  const isServer = typeof window === "undefined";
  let token: string | null = null;

  if (options.auth) {
    if (isServer) {
      const cookieStore = await cookies();
      token = cookieStore.get(tokenPath)?.value ?? null;
    } else {
      token = localStorage.getItem(tokenPath);

      if (!token) {
        onUnauthorized && (await onUnauthorized());
        throw new Error("Access token missing");
      }
    }
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, {
    method: options.method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: "include",
    cache: options.cache ?? "no-cache",
    next: options.revalidate !== false ? { revalidate: options.revalidate } : undefined,
  });

  if (res.status === 401) {
    onUnauthorized && (await onUnauthorized());
    throw new Error("Unauthorized (401)");
  }

  return res;
}

export function createFetch(config: FetcherConfig) {
  return async function fetch(
    endpoint: string,
    options: FetchOptions
  ): Promise<Response> {
    const url = `${config.baseUrl}${endpoint}`;
    return internalFetch(
      url,
      options,
      config.tokenPath ?? "access_token",
      config.onUnauthorized
    );
  };
}
