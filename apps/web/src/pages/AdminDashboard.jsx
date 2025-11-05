import { useState, useEffect } from "react";
import { getTickets, closeTicket } from "../api";
import styles from "./styles/AdminDashboard.module.css";

export default function AdminDashboard({ user, onLogout }) {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getTickets();
        setTickets(data);
      } catch (err) {
        console.error("Kunde inte hämta ärenden:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredTickets = tickets
    .filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((t) => (filter === "ALL" ? true : t.status === filter));

    async function handleStatusChange(id, newStatus) {
      try {
        await closeTicket(id); // anropa rätt API-funktion
        setTickets((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, status: newStatus } : t
          )
        );
      } catch (err) {
        console.error("Kunde inte uppdatera status:", err);
      }
    }    

  if (loading) return <p className={styles.loading}>Laddar ärenden...</p>;

  return (
    <div className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <h1>Adminpanel</h1>
        <div className={styles.headerRight}>
          <span>
            Inloggad som: <b>{user.username}</b> (Admin)
          </span>
          <button className={styles.logoutBtn} onClick={onLogout}>
            Logga ut
          </button>
        </div>
      </header>

      <div className={styles.filters}>
        <input
          className={styles.searchInput}
          placeholder="Sök efter titel..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.filterSelect}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">Alla</option>
          <option value="OPEN">Öppna</option>
          <option value="CLOSED">Stängda</option>
        </select>
      </div>

      <table className={styles.adminTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Titel</th>
            <th>Beskrivning</th>
            <th>Prioritet</th>
            <th>Status</th>
            <th>Åtgärd</th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.title}</td>
              <td>{t.desc}</td>
              <td>{t.priority}</td>
              <td>{t.status}</td>
              <td>
                <button
                  className={styles.statusBtn}
                  onClick={() =>
                    handleStatusChange(
                      t.id,
                      t.status === "OPEN" ? "CLOSED" : "OPEN"
                    )
                  }
                >
                  {t.status === "OPEN" ? "Stäng" : "Öppna"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
