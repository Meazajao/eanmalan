import { useState, useEffect } from 'react';
import { getTickets, createTicket } from './api';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import './App.css';

export default function App() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getTickets();
        setTickets(data);
      } catch {
        setError('Kunde inte läsa tickets');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleCreate(form) {
    try {
      setLoading(true);
      const created = await createTicket(form);
      setTickets(prev => [created, ...prev]);
    } catch {
      setError('Kunde inte skapa ticket');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-container">
      <h1 className="app-title">E-Anmälan</h1>
      {error && <p className="error-text">{error}</p>}
      <TicketForm onCreate={handleCreate} loading={loading} />
      <TicketList tickets={tickets} />
    </main>
  );
}
