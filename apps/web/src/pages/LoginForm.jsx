import { useState } from "react";
import styles from "./styles/LoginForm.module.css";

export default function LoginForm({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" eller "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const endpoint =
      mode === "login"
        ? "http://localhost:3001/auth/login"
        : "http://localhost:3001/auth/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setError(
          mode === "login"
            ? "Fel användarnamn eller lösenord"
            : "Kunde inte skapa konto"
        );
        return;
      }

      const data = await res.json();

      if (mode === "login") {
        // 👇 Spara token OCH user-data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // 👇 Skicka båda till App.jsx
        onLogin(data.user, data.token);
      } else {
        alert("Konto skapat! Du kan nu logga in ✅");
        setMode("login");
        setUsername("");
        setPassword("");
      }
    } catch (err) {
      console.error("Fel vid inloggning:", err);
      setError("Serverfel, försök igen senare");
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>
          {mode === "login" ? "Logga in till E-Anmälan" : "Skapa konto"}
        </h2>

        <input
          className={styles.input}
          placeholder="Användarnamn"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className={styles.button} type="submit">
          {mode === "login" ? "Logga in" : "Skapa konto"}
        </button>

        {error && <p className={styles.error}>{error}</p>}

        <p className={styles.switch}>
          {mode === "login" ? (
            <>
              Inget konto?{" "}
              <span onClick={() => setMode("register")}>Skapa ett här</span>
            </>
          ) : (
            <>
              Har du redan ett konto?{" "}
              <span onClick={() => setMode("login")}>Logga in här</span>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
