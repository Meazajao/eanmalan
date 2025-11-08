import { useState, useEffect } from "react";
import { getTickets, closeTicket } from "../api.js";
import TicketChat from "../components/MessageBox.jsx"; 
import styles from "./styles/AdminDashboard.module.css";

export default function AdminDashboard({ user, onLogout }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTicket, setActiveTicket] = useState(null); 

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getTickets();
        setTickets(data);
      } catch {
        setError("Kunde inte hämta ärenden");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleClose(id) {
    try {
      await closeTicket(id);
      setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: "CLOSED" } : t)));
    } catch {
      setError("Kunde inte stänga ärendet");
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
        <div>
          <p>Inloggad som: <strong>{user.username}</strong></p>
          <button onClick={onLogout}>Logga ut</button>
        </div>
      </header>

      <section className={styles.ticketList}>
        <h2>Alla ärenden</h2>
        {error && <p className={styles.error}>{error}</p>}
        {loading ? (
          <p>Laddar...</p>
        ) : tickets.length === 0 ? (
          <p>Inga ärenden ännu.</p>
        ) : (
          <ul>
            {tickets.map((t) => (
              <li key={t.id} className={styles.ticket}>
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
                <p><strong>Skapad av:</strong> {t.user?.username}</p>
                <p><strong>Status:</strong> {t.status}</p>

                <div className={styles.actions}>
                  <button
                    onClick={() => setActiveTicket(t.id)} 
                    className={styles.chatButton}
                  >
                    Meddelanden
                  </button>

                  {t.status !== "CLOSED" && (
                    <button onClick={() => handleClose(t.id)} className={styles.closeButton}>
                      Stäng ärende
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {activeTicket && (
        <TicketChat
          ticketId={activeTicket}
          user={user}
          onClose={() => setActiveTicket(null)} 
        />
      )}
    </div>
  );
}
