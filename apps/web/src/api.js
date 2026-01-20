const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

async function request(path, opts = {}) {
  const url = `${API_BASE}${path}`;

  const init = {
    method: opts.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
    credentials: "include",
    ...opts,
  };

  if (init.body === undefined) {
    delete init.body;
  }

  const res = await fetch(url, init);
  const text = await res.text();

  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text || null;
  }

  if (!res.ok) {
    const message =
      (body && typeof body === "object" && body.error) ||
      (typeof body === "string" && body) ||
      `Request failed: ${res.status}`;

    const err = new Error(message);
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return body;
}

function buildQuery(params = {}) {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );

  if (!entries.length) return "";

  const q = entries
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

  return `?${q}`;
}

// Auth
export function register(payload) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logout() {
  return request("/auth/logout", { method: "POST" });
}

export function me() {
  return request("/auth/me", { method: "GET" });
}

// Tickets
export function getTickets({ limit, offset, status, search } = {}) {
  const qp = buildQuery({ limit, offset, status, search });
  return request(`/tickets${qp}`, { method: "GET" });
}

export function getTicket(id) {
  if (!id) throw new Error("Ticket id saknas");
  return request(`/tickets/${encodeURIComponent(id)}`, { method: "GET" });
}

export function createTicket({ title, desc, priority = 2 }) {
  return request("/tickets", {
    method: "POST",
    body: JSON.stringify({ title, desc, priority }),
  });
}

export function closeTicket(id) {
  if (!id) throw new Error("Ticket id saknas");

  return request(`/tickets/${encodeURIComponent(id)}/close`, {
    method: "PATCH",
  });
}

// Messages
export function getMessages(ticketId, { limit, offset } = {}) {
  if (!ticketId) throw new Error("ticketId saknas");

  const qp = buildQuery({ limit, offset });
  return request(`/messages/${encodeURIComponent(ticketId)}${qp}`, {
    method: "GET",
  });
}

export function sendMessage(ticketId, text) {
  if (!ticketId) throw new Error("ticketId saknas");

  return request(`/messages/${encodeURIComponent(ticketId)}`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}
