import MessageBox from "./MessageBox.jsx";

export default function MessageModal({ open, ticketId, user, onClose, variant = "center" }) {
  if (!open || !ticketId) return null;

  if (variant === "slide") {
    return (
      <div className="fixed inset-0 z-50 flex">
        <div
          className="absolute inset-0 bg-black/40"
          onClick={onClose}
        />
        <aside className="relative ml-auto w-full max-w-2xl h-full bg-white shadow-2xl flex flex-col">
          <div className="flex justify-between items-center px-5 py-4 border-b border-slate-200 bg-white">
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900">Meddelanden</h3>
              <p className="text-xs text-slate-500 mt-1 truncate">
                Ärende #{ticketId}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-yellow-300 hover:bg-slate-800 transition"
            >
              Stäng
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <MessageBox ticketId={ticketId} user={user} />
          </div>
        </aside>
      </div>
    );
  }

  // variant === "center" (admin)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Stäng meddelanden"
      />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900">Meddelanden</h3>
            <p className="text-xs text-slate-500 mt-1 truncate">
              Ärende #{ticketId}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-yellow-300 hover:bg-slate-800 transition"
          >
            Stäng
          </button>
        </div>
        <MessageBox ticketId={ticketId} user={user} />
      </div>
    </div>
  );
}