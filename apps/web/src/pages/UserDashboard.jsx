import { useState, useEffect } from "react";
import { getTickets, createTicket } from "../api";
import styles from "./styles/UserDashboard.module.css";

export default function UserDashboard({ user, onLogout }) {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({ title: "", desc: "", priority: 2 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getTickets();
        setTickets(data);
      } catch {
        setError("Kunde inte hämta dina ärenden");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const created = await createTicket(form);
      setTickets(prev => [created, ...prev]);
      setForm({ title: "", desc: "", priority: 2 });
    } catch {
      setError("Kunde inte skapa ärendet");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>E-Anmälan</h1>
        <div className={styles.userInfo}>
          <p>Inloggad som: <strong>{user.username}</strong></p>
          <button onClick={onLogout}>Logga ut</button>
        </div>
      </header>

      <section className={styles.formSection}>
        <h2>Skapa nytt ärende</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            placeholder="Titel"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Beskrivning"
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
            required
          />
          <label>
            Prioritet:
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })}
            >
              <option value={1}>1 — Hög</option>
              <option value={2}>2 — Medium</option>
              <option value={3}>3 — Låg</option>
            </select>
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Skickar..." : "Skapa ärende"}
          </button>
        </form>
      </section>

      <section className={styles.ticketList}>
        <h2>Mina ärenden</h2>
        {error && <p className={styles.error}>{error}</p>}
        {tickets.length === 0 ? (
          <p>Inga ärenden ännu.</p>
        ) : (
          <ul className={styles.ticketListInner}>
          {tickets.map((t) => (
            <li
              key={t.id}
              className={`${styles.ticket} ${
                selectedTicket?.id === t.id ? styles.active : ""
              }`}
              onClick={() => setSelectedTicket(t)}
            >
              <h3>{t.title}</h3>
              <p>{t.desc}</p>
              <p><strong>Prioritet:</strong> {t.priority}</p>
              <p><strong>Status:</strong> {t.status}</p>
              <p><small>Skapad: {new Date(t.createdAt).toLocaleString()}</small></p>
            </li>
          ))}
        </ul>


        )}
      </section>
    </div>
  );
}
