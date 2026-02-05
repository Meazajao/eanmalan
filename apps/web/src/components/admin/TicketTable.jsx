import { useNavigate } from "react-router-dom";

export default function TicketTable({ tickets, loading, error }) {
  const navigate = useNavigate();

  if (loading) return <p>Laddar ärenden…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!tickets || tickets.length === 0) return <p>Inga ärenden.</p>;

  return (
    <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
      <div className="w-full overflow-x-auto [-webkit-overflow-scrolling:touch]">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-3 text-left">Titel</th>

              <th className="hidden sm:table-cell p-3 text-left">Skapad av</th>
              <th className="hidden md:table-cell p-3 text-left">Datum</th>

              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Åtgärd</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((t) => {
              const isClosed = t.status === "CLOSED";
              const date = t.createdAt
                ? new Date(t.createdAt).toLocaleDateString("sv-SE")
                : "—";

              return (
                <tr key={t.id} className="border-t hover:bg-slate-50">
                  <td className="p-3 font-medium text-slate-900">
                    <div className="wrap-break-word">{t.title}</div>

                    
                    <div className="sm:hidden mt-1 text-xs text-slate-500">
                      {t.user?.username ? `Av: ${t.user.username}` : "—"}
                      {" • "}
                      {date}
                    </div>
                  </td>

                  <td className="hidden sm:table-cell p-3">
                    {t.user?.username || "—"}
                  </td>

                  <td className="hidden md:table-cell p-3">{date}</td>

                  <td className="p-3">
                    <span
                      className={[
                        "px-2 py-1 rounded text-xs border",
                        isClosed
                          ? "bg-gray-100 text-gray-700 border-gray-200"
                          : "bg-blue-50 text-blue-800 border-blue-200",
                      ].join(" ")}
                    >
                      {isClosed ? "Avslutad" : "Pågående"}
                    </span>
                  </td>

                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/tickets/${t.id}`)}
                      className="inline-flex w-full sm:w-auto justify-center px-3 py-2 rounded-lg text-sm font-semibold border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    >
                      Öppna
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
