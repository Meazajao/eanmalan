function formatDate(dt) {
  return new Date(dt).toLocaleString("sv-SE");
}

function priorityBadge(priority) {
  if (priority === 1) return "bg-red-50 text-red-700 border-red-200";
  if (priority === 2) return "bg-amber-50 text-amber-800 border-amber-200";
  return "bg-emerald-50 text-emerald-700 border-emerald-200";
}

function priorityText(priority) {
  if (priority === 1) return "Hög";
  if (priority === 2) return "Medium";
  return "Låg";
}

function statusBadge(status) {
  return status === "CLOSED"
    ? "bg-slate-100 text-slate-700 border-slate-200"
    : "bg-blue-50 text-blue-700 border-blue-200";
}

export default function TicketCard({
  ticket,
  expanded,
  onToggleExpand,
  onOpenMessages,
}) {
  const desc = ticket?.desc || "";
  const showText =
    desc.length > 250 && !expanded ? `${desc.slice(0, 250)}…` : desc;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 break-words">
            {ticket.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {formatDate(ticket.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-1 rounded-full border font-medium ${priorityBadge(
              ticket.priority
            )}`}
          >
            {priorityText(ticket.priority)}
          </span>

          <span
            className={`text-xs px-2 py-1 rounded-full border font-medium ${statusBadge(
              ticket.status
            )}`}
          >
            {ticket.status === "CLOSED" ? "Avslutad" : "Pågående"}
          </span>
        </div>
      </div>

      <p className="text-sm text-slate-700 mt-3 leading-relaxed break-words whitespace-pre-wrap">
        {showText}
      </p>

      {desc.length > 250 && (
        <button
          type="button"
          onClick={onToggleExpand}
          className="text-xs text-blue-700 font-medium mt-1 hover:underline"
        >
          {expanded ? "Visa mindre" : "Visa mer"}
        </button>
      )}

      <div className="flex justify-end mt-4 pt-3 border-t border-slate-200">
        <button
          type="button"
          onClick={() => onOpenMessages(ticket.id)}
          className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-yellow-300 hover:bg-slate-800 transition"
        >
          Meddelanden
        </button>
      </div>
    </div>
  );
}
