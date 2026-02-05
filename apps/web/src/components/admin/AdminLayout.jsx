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
          // Mobil: chips / Desktop: fullbredd-knapp
          "shrink-0 md:w-full md:text-left px-3 py-2 rounded text-sm font-medium border",
          isActive
            ? "bg-slate-800 text-slate-100 border-slate-700"
            : "bg-transparent text-slate-200/80 border-transparent hover:text-slate-100 hover:bg-slate-800/40 hover:border-slate-700",
        ].join(" ")}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      {/* ASIDE: toppbar på mobil, sidomeny på desktop */}
      <aside className="bg-slate-900 text-slate-100 md:w-64 md:min-h-screen md:flex md:flex-col">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-700">
          <h1 className="text-lg font-semibold">Ärendehantering</h1>
          <p className="text-xs text-slate-400 mt-1">Intern vy</p>
        </div>

        {showFilters ? (
          <nav
            className={[
              // Mobil: horisontell filter-rad med scroll
              "px-4 sm:px-6 py-3 flex gap-2 overflow-x-auto",
              // Desktop: vertikal lista
              "md:flex-1 md:flex-col md:space-y-2 md:overflow-visible",
            ].join(" ")}
          >
            {renderNavButton("ALL", "Alla ärenden")}
            {renderNavButton("OPEN", "Pågående")}
            {renderNavButton("CLOSED", "Avslutade")}
          </nav>
        ) : (
          <div className="hidden md:block md:flex-1" />
        )}

        {/* Mobil: komprimerad user-rad | Desktop: klassisk block */}
        <div className="px-4 sm:px-6 py-4 border-t border-slate-700 text-xs">
          {/* Mobilrad */}
          <div className="flex items-center justify-between gap-3 md:hidden">
            <div className="min-w-0">
              <span className="text-slate-300">Inloggad som </span>
              <strong className="text-slate-100 truncate block">
                {user?.username || "-"}
              </strong>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="shrink-0 text-red-300 hover:text-red-400"
            >
              Logga ut
            </button>
          </div>

          {/* Desktopblock */}
          <div className="hidden md:block">
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
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-300 px-4 sm:px-6 md:px-8 py-4 space-y-3">
          <h2 className="text-xl font-semibold text-slate-800">{title}</h2>

          {showSearch && (
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Sök ärende (titel, beskrivning, id, användare...)"
              className="w-full md:max-w-xl border border-slate-300 rounded px-3 py-2 text-sm"
            />
          )}
        </header>

        <section className="flex-1 p-4 sm:p-6 md:p-8 min-w-0">
          {children}
        </section>

        <footer className="bg-white border-t border-slate-300 text-xs text-slate-500 text-center py-3">
          © 2025 E-Anmälan – Intern administration
        </footer>
      </main>
    </div>
  );
}
