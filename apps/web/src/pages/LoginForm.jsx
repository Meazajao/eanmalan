import { useState } from "react";
import { login, me, register } from "../api.js";

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [showPassword, setShowPassword] = useState(false);

  const gradientBg =
    "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700";

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      if (mode === "signup") {
        await register({ username, password });
      } else {
        await login({ username, password });
      }

      const { user: currentUser } = await me();
      onLogin(currentUser);

      setUsername("");
      setPassword("");
    } catch (err) {
      setError(err?.message || "Serverfel");
    } finally {
      setIsLoading(false);
    }
  }

  function toggleMode() {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-slate-900 p-6 shadow-md">
        <h1 className="text-3xl font-bold text-white text-center">E-Anmälan</h1>
      </header>

      <main className={`flex-1 flex items-center justify-center ${gradientBg}`}>
        <div className="w-full max-w-md p-10 bg-slate-800 rounded-3xl shadow-2xl space-y-6">
          <h2 className="text-3xl font-extrabold text-white text-center">
            {mode === "login" ? "Logga in" : "Skapa konto"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder={
                mode === "login" ? "Användarnamn" : "Välj användarnamn"
              }
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 placeholder-slate-400"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={mode === "login" ? "Lösenord" : "Välj lösenord"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3 rounded-2xl bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 placeholder-slate-400"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-300 hover:text-yellow-300 font-bold"
              >
                {showPassword ? "Dölj" : "Visa"}
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl font-bold text-black bg-yellow-400 hover:bg-yellow-300 transition-colors disabled:opacity-60"
            >
              {isLoading
                ? "Bearbetar..."
                : mode === "login"
                ? "Logga in"
                : "Skapa konto"}
            </button>
          </form>

          <p className="text-center text-slate-300">
            {mode === "login" ? "Inget konto?" : "Redan medlem?"}{" "}
            <button
              type="button"
              className="text-yellow-300 font-semibold hover:underline"
              onClick={toggleMode}
            >
              {mode === "login" ? "Skapa konto" : "Logga in"}
            </button>
          </p>
        </div>
      </main>

      <footer className="bg-slate-900 p-4 text-center text-white text-sm">
        &copy; 2025 Meaza Support. Alla rättigheter förbehållna.
      </footer>
    </div>
  );
}
