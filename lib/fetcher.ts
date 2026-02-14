import Cookies from 'js-cookie';

const BASE_URL = 'https://api-ekak.zeabur.app';

export async function fetchApi<T = unknown>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const token = Cookies.get('bearer_token');

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
}
