import { useState, useEffect } from "react";
import styles from "./styles/MessageBox.module.css";

export default function MessageBox({ ticketId, user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Hämta alla meddelanden för detta ärende
  useEffect(() => {
    async function fetchMessages() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3001/messages/${ticketId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Kunde inte hämta meddelanden");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        setError("Fel vid hämtning av meddelanden");
      }
    }
    fetchMessages();
  }, [ticketId]);

  // Skicka nytt meddelande
  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/messages/${ticketId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Kunde inte skicka meddelande");
      const newMsg = await res.json();
      setMessages((prev) => [...prev, newMsg]);
      setText("");
    } catch (err) {
      console.error(err);
      setError("Fel vid skickande av meddelande");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.chatBox}>
      <h3 className={styles.title}>💬 Meddelanden</h3>
      <div className={styles.messages}>
        {messages.length === 0 ? (
          <p className={styles.empty}>Inga meddelanden ännu</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.message} ${
                msg.sender.role === "ADMIN" ? styles.admin : styles.user
              }`}
            >
              <p className={styles.sender}>
                {msg.sender.username} ({msg.sender.role})
              </p>
              <p className={styles.text}>{msg.text}</p>
              <p className={styles.time}>
                {new Date(msg.createdAt).toLocaleTimeString()}
              </p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSend} className={styles.form}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Skriv ett meddelande..."
        />
        <button disabled={loading} type="submit">
          {loading ? "Skickar..." : "Skicka"}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
