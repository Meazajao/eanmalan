export default function TicketItem({ ticket, onClose }) {
  const { title, desc = "", priority, status, createdAt } = ticket;

  const getPriorityColor = (prio) => {
    if (prio === 1) return "bg-red-100 text-red-800 border-red-500";
    if (prio === 2) return "bg-amber-100 text-amber-800 border-amber-500";
    return "bg-green-100 text-green-800 border-green-500";
  };

  const isClosed = status === "CLOSED";
  const priorityLabel =
    priority === 1 ? "Hög" : priority === 2 ? "Medium" : "Låg";

  return (
    <li
      className={[
        "flex flex-col p-4 rounded-lg border-l-4 shadow-sm hover:shadow-md transition break-words overflow-wrap:anywhere",
        isClosed ? "opacity-60" : "",
      ].join(" ")}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <p className="text-slate-700 text-sm mt-1">{desc}</p>
          <small className="text-slate-500 text-xs mt-1 block">
            {status} • {new Date(createdAt).toLocaleString()}
          </small>
        </div>

        {!isClosed && (
          <button
            type="button"
            onClick={() => onClose(ticket.id)}
            className="ml-4 px-3 py-1 text-xs font-semibold rounded bg-yellow-600 text-white hover:bg-yellow-500 transition"
          >
            Stäng ärende
          </button>
        )}
      </div>

      <div
        className={[
          "mt-2 inline-block px-2 py-1 text-xs font-medium rounded border",
          getPriorityColor(priority),
        ].join(" ")}
      >
        Prioritet: {priorityLabel}
      </div>
    </li>
  );
}
