export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!res.ok) {
      let errBody;
      try {
        errBody = await res.json();
      } catch {
        // Ignored
      }
      const message = errBody?.error?.message || errBody?.message || `HTTP ${res.status}: ${res.statusText}`;
      throw new Error(message);
    }

    const data = await res.json();
    return data.data !== undefined ? data.data : data;
  } catch (err: any) {
    console.warn(`[API Fetch Error] Call to ${endpoint} failed:`, err.message);
    throw err;
  }
}
