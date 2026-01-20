import { useEffect, useState } from "react";
import { getTickets } from "../api.js";
import AdminLayout from "../components/admin/AdminLayout.jsx";
import TicketTable from "../components/admin/TicketTable.jsx";

export default function AdminDashboard({ user, onLogout }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [activeFilter, setActiveFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  async function loadTickets(nextFilter = activeFilter, nextSearch = search) {
    try {
      setError("");
      setLoading(true);

      const status = nextFilter === "ALL" ? undefined : nextFilter;
      const q = nextSearch.trim() ? nextSearch.trim() : undefined;

      const data = await getTickets({ status, search: q });
      setTickets(data?.items || []);
    } catch (err) {
      setError(err?.message || "Kunde inte hämta ärenden");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadTickets(activeFilter, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, search]);

  return (
    <AdminLayout
      user={user}
      onLogout={onLogout}
      activeFilter={activeFilter}
      onChangeFilter={setActiveFilter}
      search={search}
      onSearchChange={setSearch}
    >
      <TicketTable tickets={tickets} loading={loading} error={error} />
    </AdminLayout>
  );
}
