import { useNavigate } from "react-router-dom";

export default function TicketTable({ tickets, loading, error }) {
  const navigate = useNavigate();

  if (loading) return <p>Laddar ärenden…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!tickets.length) return <p>Inga ärenden.</p>;

  return (
    <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="p-3 text-left">Titel</th>
            <th className="p-3 text-left">Skapad av</th>
            <th className="p-3 text-left">Datum</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-right">Åtgärd</th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((t) => {
            const isClosed = t.status === "CLOSED";

            return (
              <tr key={t.id} className="border-t hover:bg-slate-50">
                <td className="p-3 font-medium">{t.title}</td>
                <td className="p-3">{t.user?.username}</td>
                <td className="p-3">
                  {new Date(t.createdAt).toLocaleDateString("sv-SE")}
                </td>
                <td className="p-3">
                  <span
                    className={[
                      "px-2 py-1 rounded text-xs",
                      isClosed
                        ? "bg-gray-200 text-gray-700"
                        : "bg-blue-100 text-blue-800",
                    ].join(" ")}
                  >
                    {isClosed ? "Avslutad" : "Pågående"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/tickets/${t.id}`)}
                    className="text-blue-700 hover:underline"
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
  );
}
