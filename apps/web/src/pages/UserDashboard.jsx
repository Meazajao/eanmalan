import { useEffect, useState } from "react";
import { createTicket, getTickets } from "../api.js";
import MessageBox from "../components/messages/MessageBox.jsx";
import UserLayout from "../components/user/UserLayout.jsx";
import TicketCard from "../components/user/TicketCard.jsx";

export default function UserDashboard({ user, onLogout }) {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({ title: "", desc: "", priority: 2 });

  const [loading, setLoading] = useState(false); // create
  const [fetching, setFetching] = useState(false); // list
  const [error, setError] = useState("");

  const [activeTicket, setActiveTicket] = useState(null);
  const [expandedTickets, setExpandedTickets] = useState([]);

  const [activeFilter, setActiveFilter] = useState("ALL"); // ALL | OPEN | CLOSED
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) return;

    let mounted = true;

    async function fetchTickets() {
      try {
        setError("");
        setFetching(true);

        const status = activeFilter === "ALL" ? undefined : activeFilter;
        const q = search.trim() ? search.trim() : undefined;

        const data = await getTickets({ status, search: q });
        const items = Array.isArray(data?.items) ? data.items : [];

        if (mounted) setTickets(items);
      } catch (err) {
        if (mounted) setError(err?.message || "Kunde inte hämta ärenden.");
      } finally {
        if (mounted) setFetching(false);
      }
    }

    fetchTickets();

    return () => {
      mounted = false;
    };
  }, [user, activeFilter, search]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const title = form.title.trim();
    const desc = form.desc.trim();

    if (!title || !desc) {
      setError("Titel och beskrivning får inte vara tomma.");
      return;
    }

    try {
      setLoading(true);
      const created = await createTicket(form);

      if (activeFilter === "CLOSED") {
        setActiveFilter("ALL");
      } else {
        setTickets((prev) => [created, ...prev]);
      }

      setForm({ title: "", desc: "", priority: 2 });
      setActiveTicket(created.id);
    } catch (err) {
      setError(err?.message || "Kunde inte skapa ärende.");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setForm({ title: "", desc: "", priority: 2 });
    setError("");
  }

  function toggleExpand(id) {
    setExpandedTickets((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function chipClass(active) {
    return [
      "px-3 py-1.5 rounded-full text-sm border transition",
      active
        ? "bg-slate-900 text-white border-slate-900"
        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
    ].join(" ");
  }

  return (
    <UserLayout user={user} onLogout={onLogout}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 lg:sticky lg:top-24">
            <h2 className="text-base font-semibold text-slate-900">
              Skapa nytt ärende
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Beskriv problemet så tydligt som möjligt.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <input
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/60 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300"
                placeholder="Titel"
                value={form.title}
                onChange={(e) =>
                  setForm((s) => ({ ...s, title: e.target.value }))
                }
              />

              <textarea
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/60 resize-none focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300"
                rows={5}
                placeholder="Beskriv ditt ärende..."
                value={form.desc}
                onChange={(e) =>
                  setForm((s) => ({ ...s, desc: e.target.value }))
                }
              />

              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-700">Prioritet</span>
                <select
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
                  value={form.priority}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      priority: Number(e.target.value),
                    }))
                  }
                >
                  <option value={1}>Hög</option>
                  <option value={2}>Medium</option>
                  <option value={3}>Låg</option>
                </select>
              </div>

              {error && (
                <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition disabled:opacity-60"
                >
                  {loading ? "Skickar..." : "Skapa ärende"}
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 transition"
                >
                  Rensa
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex flex-col gap-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Mina ärenden
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {fetching ? "Hämtar..." : `${tickets.length} ärenden`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={chipClass(activeFilter === "ALL")}
                  onClick={() => setActiveFilter("ALL")}
                >
                  Alla
                </button>
                <button
                  type="button"
                  className={chipClass(activeFilter === "OPEN")}
                  onClick={() => setActiveFilter("OPEN")}
                >
                  Pågående
                </button>
                <button
                  type="button"
                  className={chipClass(activeFilter === "CLOSED")}
                  onClick={() => setActiveFilter("CLOSED")}
                >
                  Avslutade
                </button>
              </div>
            </div>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Sök i dina ärenden (titel, beskrivning, id...)"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/60 focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          {!fetching && tickets.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-700 shadow-sm">
              Inga ärenden att visa. Skapa ett nytt till vänster.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {tickets.map((t) => (
                <TicketCard
                  key={t.id}
                  ticket={t}
                  expanded={expandedTickets.includes(t.id)}
                  onToggleExpand={() => toggleExpand(t.id)}
                  onOpenMessages={(ticketId) => setActiveTicket(ticketId)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {activeTicket && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setActiveTicket(null)}
          />

          <aside className="relative ml-auto w-full max-w-2xl h-full bg-white shadow-2xl flex flex-col">
            <div className="flex justify-between items-center px-5 py-4 border-b border-slate-200 bg-white">
              <div className="min-w-0">
                <h3 className="font-semibold text-slate-900">Meddelanden</h3>
                <p className="text-xs text-slate-500 mt-1 truncate">
                  Ärende #{activeTicket}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTicket(null)}
                className="px-3 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-yellow-300 hover:bg-slate-800 transition"
              >
                Stäng
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              <MessageBox ticketId={activeTicket} user={user} />
            </div>
          </aside>
        </div>
      )}
    </UserLayout>
  );
}
