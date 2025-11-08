const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

// Token
export function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Tickets
export async function getTickets() {
  const r = await fetch(`${API_BASE}/tickets`, {
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  });
  if (!r.ok) throw new Error("GET /tickets failed");
  return r.json();
}

export async function createTicket({ title, desc, priority = 2 }) {
  const r = await fetch(`${API_BASE}/tickets`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({ title, desc, priority }),
  });
  if (!r.ok) throw new Error("POST /tickets failed");
  return r.json();
}

export async function closeTicket(id) {
  const r = await fetch(`${API_BASE}/tickets/${id}/close`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  });
  if (!r.ok) throw new Error("PATCH /tickets/:id/close failed");
  return r.json();
}

//  Messages
export async function getMessages(ticketId) {
  const r = await fetch(`${API_BASE}/messages/${ticketId}`, {
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  });
  if (!r.ok) throw new Error("GET /messages failed");
  return r.json();
}

export async function sendMessage(ticketId, text) {
  const r = await fetch(`${API_BASE}/messages/${ticketId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({ text }),
  });
  if (!r.ok) throw new Error("POST /messages failed");
  return r.json();
}
