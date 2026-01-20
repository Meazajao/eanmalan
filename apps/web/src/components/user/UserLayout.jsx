export default function UserLayout({ user, onLogout, children }) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-slate-50 to-white">
        <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold text-white tracking-tight">
                E-Anmälan
              </h1>
              <p className="text-sm text-slate-300">
                Välkommen,{" "}
                <span className="font-semibold text-yellow-300">
                  {user?.username}
                </span>
              </p>
            </div>
  
            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-yellow-300 text-slate-900 hover:bg-yellow-400 transition"
            >
              Logga ut
            </button>
          </div>
        </header>
  
        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-6 py-10">{children}</div>
        </main>
  
        <footer className="bg-slate-900 text-yellow-300 text-xs text-center py-4 mt-auto">
          © 2025 Meaza Support. Alla rättigheter förbehållna.
        </footer>
      </div>
    );
  }
  