import { useEffect, useState } from "react";
import styles from "./styles/MessageBox.module.css";
import { getAuthHeaders } from "../api.js"; 
export default function TicketChat({ ticketId, user, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  //  Hämta meddelanden
  async function fetchMessages() {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3001/messages/${ticketId}`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });
      if (!res.ok) throw new Error("Kunde inte hämta meddelanden");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  //  Skicka meddelande
  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      setSending(true);
      const res = await fetch(`http://localhost:3001/messages/${ticketId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Kunde inte skicka meddelande");
      const msg = await res.json();
      setMessages((prev) => [...prev, msg]);
      setText("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    fetchMessages();
  }, [ticketId]);

  return (
    <div className={styles.overlay}>
      <div className={styles.chatBox}>
        <header className={styles.header}>
          <h2>Ärende: {ticketId}</h2>
          <button onClick={onClose}>Stäng</button>
        </header>

        <div className={styles.messages}>
          {loading ? (
            <p>Laddar meddelanden...</p>
          ) : messages.length === 0 ? (
            <p className={styles.empty}>Inga meddelanden ännu</p>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`${styles.message} ${
                  m.sender.role === "ADMIN" ? styles.admin : styles.user
                }`}
              >
                <div className={styles.bubble}>
                  <p>{m.text}</p>
                  <small>
                    {m.sender.username} •{" "}
                    {new Date(m.createdAt).toLocaleTimeString()}
                  </small>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSend} className={styles.inputArea}>
          <input
            type="text"
            placeholder="Skriv ett meddelande..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={sending}
          />
          <button type="submit" disabled={sending || !text.trim()}>
            {sending ? "Skickar..." : "Skicka"}
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}
