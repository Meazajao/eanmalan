export default function AdminLayout({
  user,
  onLogout,
  children,
  activeFilter = "ALL", // "ALL" | "OPEN" | "CLOSED"
  onChangeFilter = () => {},
  search = "",
  onSearchChange = () => {},

  titleOverride = "",
  showFilters = true,
  showSearch = true,
}) {
  const computedTitle =
    activeFilter === "OPEN"
      ? "Pågående ärenden"
      : activeFilter === "CLOSED"
      ? "Avslutade ärenden"
      : "Alla ärenden";

  const title = titleOverride || computedTitle;

  function renderNavButton(key, label) {
    const isActive = activeFilter === key;

    return (
      <button
        type="button"
        onClick={() => onChangeFilter(key)}
        className={[
          "w-full text-left px-3 py-2 rounded",
          isActive
            ? "bg-slate-800 text-slate-100"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40",
        ].join(" ")}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-100">
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col">
        <div className="px-6 py-5 border-b border-slate-700">
          <h1 className="text-lg font-semibold">Ärendehantering</h1>
          <p className="text-xs text-slate-400 mt-1">Intern vy</p>
        </div>

        {showFilters ? (
          <nav className="flex-1 px-4 py-4 space-y-2 text-sm">
            {renderNavButton("ALL", "Alla ärenden")}
            {renderNavButton("OPEN", "Pågående")}
            {renderNavButton("CLOSED", "Avslutade")}
          </nav>
        ) : (
          <div className="flex-1" />
        )}

        <div className="px-6 py-4 border-t border-slate-700 text-xs">
          Inloggad som
          <br />
          <strong className="text-slate-200">{user?.username || "-"}</strong>

          <button
            type="button"
            onClick={onLogout}
            className="block mt-3 text-red-300 hover:text-red-400"
          >
            Logga ut
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="bg-white border-b border-slate-300 px-8 py-4 space-y-3">
          <h2 className="text-xl font-semibold text-slate-800">{title}</h2>

          {showSearch && (
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Sök ärende (titel, beskrivning, id, användare...)"
              className="w-full max-w-xl border border-slate-300 rounded px-3 py-2 text-sm"
            />
          )}
        </header>

        <section className="flex-1 p-8">{children}</section>

        <footer className="bg-white border-t border-slate-300 text-xs text-slate-500 text-center py-3">
          © 2025 E-Anmälan – Intern administration
        </footer>
      </main>
    </div>
  );
}
