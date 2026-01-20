import { useEffect, useRef, useState } from "react";
import { getMessages, sendMessage } from "../../api.js";

function formatTime(dt) {
  try {
    return new Date(dt).toLocaleString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function MessageBox({ ticketId, user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const endRef = useRef(null);

  useEffect(() => {
    if (!ticketId) return;

    let cancelled = false;

    async function fetchMessages() {
      try {
        setError("");
        setLoading(true);

        const data = await getMessages(ticketId);
        const items = Array.isArray(data) ? data : data?.items || [];

        if (!cancelled) setMessages(items);
      } catch (err) {
        if (!cancelled) setError(err?.message || "Kunde inte hämta meddelanden");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchMessages();

    return () => {
      cancelled = true;
    };
  }, [ticketId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!ticketId || !text.trim()) return;

    try {
      setError("");
      setSending(true);

      const msg = await sendMessage(ticketId, text.trim());
      setMessages((prev) => [...prev, msg]);
      setText("");
    } catch (err) {
      setError(err?.message || "Kunde inte skicka meddelandet");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-[520px] bg-white">
      <div className="px-5 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900">
              Meddelanden
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Svara på ärendet och håll konversationen samlad.
            </p>
          </div>

          <span className="text-xs px-2 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700 font-medium">
            Ärende #{ticketId}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 bg-slate-50">
        {loading ? (
          <p className="text-sm text-slate-500 text-center py-8">
            Laddar meddelanden…
          </p>
        ) : messages.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-slate-500">Inga meddelanden ännu</p>
            <p className="text-xs text-slate-400 mt-1">
              Skriv ett meddelande nedan för att starta.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => {
              const mine = m.sender?.id
                ? m.sender.id === user?.id
                : m.sender?.username === user?.username;

              return (
                <div
                  key={m.id}
                  className={["flex", mine ? "justify-end" : "justify-start"].join(
                    " "
                  )}
                >
                  <div
                    className={[
                      "max-w-[85%] rounded-2xl px-4 py-3 border shadow-sm",
                      mine
                        ? "bg-slate-900 text-yellow-100 border-slate-900"
                        : "bg-white text-slate-900 border-slate-200",
                    ].join(" ")}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {m.text}
                    </p>

                    <div
                      className={[
                        "mt-2 flex items-center gap-2 text-xs",
                        mine ? "text-yellow-200/90" : "text-slate-500",
                      ].join(" ")}
                    >
                      <span className="font-medium">
                        {m.sender?.username || (mine ? "Du" : "Okänd")}
                      </span>
                      <span className="opacity-70">•</span>
                      <span className="opacity-90">
                        {formatTime(m.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={endRef} />
          </div>
        )}
      </div>

      <form
        onSubmit={handleSend}
        className="p-4 border-t border-slate-200 bg-white"
      >
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <div className="flex items-stretch gap-2">
          <textarea
            id="message"
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={sending}
            placeholder="Skriv ett meddelande…"
            className="flex-1 resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300"
          />

          <button
            type="submit"
            disabled={sending || !text.trim()}
            className={[
              "shrink-0 self-stretch px-5 rounded-xl text-sm font-semibold transition",
              sending || !text.trim()
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : "bg-slate-900 text-yellow-300 hover:bg-slate-800",
            ].join(" ")}
          >
            {sending ? "Skickar…" : "Skicka"}
          </button>
        </div>
      </form>
    </div>
  );
}
