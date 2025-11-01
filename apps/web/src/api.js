const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

export async function getTickets() {
  const r = await fetch(`${API_BASE}/tickets`);
  if (!r.ok) throw new Error('GET /tickets failed');
  return r.json();
}

export async function createTicket({ title, desc, priority = 2 }) {
  const r = await fetch(`${API_BASE}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, desc, priority }),
  });
  if (!r.ok) throw new Error('POST /tickets failed');
  return r.json();
}
