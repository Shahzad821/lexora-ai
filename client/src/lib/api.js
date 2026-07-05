const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const apiRequest = async (path, { token, body, ...options } = {}) => {
  const isFormData = body instanceof FormData;
  const headers = {
    ...options.headers,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
};
