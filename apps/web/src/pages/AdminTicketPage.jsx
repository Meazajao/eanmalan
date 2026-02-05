import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout.jsx";
import MessageBox from "../components/messages/MessageBox.jsx";
import { closeTicket, getTicket } from "../api.js";

function priorityMeta(priority) {
  if (priority === 1) {
    return { label: "Hög", cls: "bg-red-50 text-red-700 border-red-200" };
  }

  if (priority === 2) {
    return {
      label: "Medium",
      cls: "bg-amber-50 text-amber-800 border-amber-200",
    };
  }

  return { label: "Låg", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
}

function statusMeta(status) {
  return status === "CLOSED"
    ? { label: "Avslutad", cls: "bg-slate-100 text-slate-700 border-slate-200" }
    : { label: "Pågående", cls: "bg-blue-50 text-blue-700 border-blue-200" };
}

export default function AdminTicketPage({ user, onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [busyClose, setBusyClose] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [error, setError] = useState("");

  const messagesRef = useRef(null);

  async function load() {
    try {
      setError("");
      setLoading(true);

      const data = await getTicket(id);
      setTicket(data);
    } catch (e) {
      setTicket(null);
      setError(e?.message || "Kunde inte hämta ärendet");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    if (id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function handleRefresh() {
    if (refreshing) return;
    setRefreshing(true);
    load();
  }

  async function handleCloseTicket() {
    if (!ticket || ticket.status === "CLOSED") return;

    try {
      setBusyClose(true);
      await closeTicket(ticket.id);
      setTicket((prev) => (prev ? { ...prev, status: "CLOSED" } : prev));
    } catch (e) {
      setError(e?.message || "Kunde inte stänga ärendet");
    } finally {
      setBusyClose(false);
    }
  }

  function toggleMessages() {
    setShowMessages((v) => !v);

    setTimeout(() => {
      if (!showMessages && messagesRef.current) {
        messagesRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 0);
  }

  const created = useMemo(() => {
    if (!ticket?.createdAt) return "";
    return new Date(ticket.createdAt).toLocaleString("sv-SE");
  }, [ticket?.createdAt]);

  const prio = priorityMeta(ticket?.priority);
  const st = statusMeta(ticket?.status);

  return (
    <AdminLayout
      user={user}
      onLogout={onLogout}
      titleOverride="Ärende"
      showFilters={false}
      showSearch={false}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            <span className="text-lg leading-none">←</span>
            Tillbaka till listan
          </button>

          {ticket && (
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <span
                className={[
                  "text-xs px-2 py-1 rounded-full border font-medium",
                  st.cls,
                ].join(" ")}
              >
                {st.label}
              </span>

              <span
                className={[
                  "text-xs px-2 py-1 rounded-full border font-medium",
                  prio.cls,
                ].join(" ")}
              >
                Prioritet: {prio.label}
              </span>

              <span className="text-xs px-2 py-1 rounded-full border font-medium bg-white text-slate-700 border-slate-200">
                ID: {ticket.id}
              </span>
            </div>
          )}
        </div>

        {loading && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-600">Laddar ärendet…</p>
          </div>
        )}

        {error && (
          <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {ticket && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                    {ticket.title}
                  </h1>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                    <span>
                      Skapad av{" "}
                      <span className="font-medium text-slate-700">
                        {ticket.user?.username || "—"}
                      </span>
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span>{created}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className={[
                      "px-4 py-2 rounded-xl text-sm font-semibold border transition",
                      refreshing
                        ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {refreshing ? "Uppdaterar…" : "Uppdatera"}
                  </button>

                  <button
                    type="button"
                    onClick={toggleMessages}
                    className={[
                      "px-4 py-2 rounded-xl text-sm font-semibold border transition",
                      showMessages
                        ? "bg-slate-900 text-yellow-300 border-slate-900 hover:bg-slate-800"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {showMessages ? "Dölj meddelanden" : "Meddelanden"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCloseTicket}
                    disabled={busyClose || ticket.status === "CLOSED"}
                    className={[
                      "px-4 py-2 rounded-xl text-sm font-semibold transition",
                      ticket.status === "CLOSED"
                        ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                        : "bg-slate-900 text-yellow-300 hover:bg-slate-800",
                    ].join(" ")}
                  >
                    {ticket.status === "CLOSED"
                      ? "Ärendet är stängt"
                      : busyClose
                      ? "Stänger…"
                      : "Stäng ärende"}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-sm font-semibold text-slate-900">
                        Beskrivning
                      </h2>
                      <span className="text-xs text-slate-500">
                        {ticket.desc
                          ? `${ticket.desc.length} tecken`
                          : "0 tecken"}
                      </span>
                    </div>

                    <p className="text-sm text-slate-800 leading-relaxed wrap-break-word whitespace-pre-wrap">
                      {ticket.desc || "Ingen beskrivning."}
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="rounded-2xl border border-slate-200 p-5">
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">
                      Översikt
                    </h3>

                    <dl className="space-y-3 text-sm">
                      <div className="flex items-center justify-between gap-3 min-w-0">
                        <dt className="text-slate-500">Status</dt>
                        <dd
                          className={[
                            "px-2 py-1 rounded-full border text-xs font-medium",
                            st.cls,
                          ].join(" ")}
                        >
                          {st.label}
                        </dd>
                      </div>

                      <div className="flex items-center justify-between gap-3 min-w-0">
                        <dt className="text-slate-500">Prioritet</dt>
                        <dd
                          className={[
                            "px-2 py-1 rounded-full border text-xs font-medium",
                            prio.cls,
                          ].join(" ")}
                        >
                          {prio.label}
                        </dd>
                      </div>

                      <div className="flex items-center justify-between gap-3 min-w-0">
                        <dt className="text-slate-500">Ärende-ID</dt>
                        <dd className="text-slate-700 font-mono text-xs max-w-[180px] sm:max-w-60 overflow-x-auto whitespace-nowrap">
                          {ticket.id}
                        </dd>
                      </div>

                      <div className="flex items-center justify-between gap-3 min-w-0">
                        <dt className="text-slate-500">Skapad</dt>
                        <dd className="text-slate-700 text-xs">{created}</dd>
                      </div>

                      <div className="flex items-center justify-between gap-3 min-w-0">
                        <dt className="text-slate-500">Skapad av</dt>
                        <dd className="text-slate-700 text-xs font-medium">
                          {ticket.user?.username || "—"}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-5 pt-4 border-t border-slate-200">
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Tips: Använd “Uppdatera” om någon annan admin gör
                        ändringar samtidigt.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {showMessages && (
                <div ref={messagesRef} className="mt-6">
                  <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
                    <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                      <h2 className="text-sm font-semibold text-slate-900">
                        Meddelanden
                      </h2>

                      <button
                        type="button"
                        onClick={toggleMessages}
                        className="text-sm font-medium text-slate-600 hover:text-slate-900"
                      >
                        Stäng
                      </button>
                    </div>

                    <MessageBox ticketId={ticket.id} user={user} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
