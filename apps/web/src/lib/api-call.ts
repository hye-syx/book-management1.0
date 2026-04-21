export function getAuthorizationHeaders() {
  const headers: Record<string, string> = {};

  if (typeof window === 'undefined') {
    return headers;
  }

  const token = localStorage.getItem('bearer_token');

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}
