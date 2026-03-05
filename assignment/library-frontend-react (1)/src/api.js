const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    const message = typeof body === "string" ? body : (body?.detail || "Request failed");
    throw new Error(message);
  }
  return body;
}

export const api = {
  // Books
  listBooks: () => request("/books/"),
  createBook: (payload) => request("/books/", { method: "POST", body: JSON.stringify(payload) }),

  // Members
  listMembers: () => request("/members/"),
  createMember: (payload) => request("/members/", { method: "POST", body: JSON.stringify(payload) }),

  // Borrow / Return
  borrowBook: (bookId, memberId) => request(`/borrow/${bookId}/${memberId}`, { method: "POST" }),
  returnBook: (recordId) => request(`/borrow/return/${recordId}`, { method: "POST" }),
};

export { API_BASE_URL };
