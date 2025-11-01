import { useState } from 'react';

export default function TicketForm({ onCreate, loading }) {
  const [form, setForm] = useState({ title: '', desc: '', priority: 2 });
  const [error, setError] = useState('');

  function updateField(field, value) {
    setForm(prev => ({ ...prev, [field]: field === 'priority' ? Number(value) : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const title = form.title.trim();
    const desc = form.desc.trim();
    if (!title || !desc) {
      setError('Titel och beskrivning får inte vara tomma');
      return;
    }
    setError('');
    await onCreate(form);
    setForm({ title: '', desc: '', priority: 2 });
  }

  return (
    <form onSubmit={handleSubmit} className="ticket-form">
      {error && <p className="error-text">{error}</p>}
      <input
        className="ticket-input"
        placeholder="Titel"
        value={form.title}
        onChange={e => updateField('title', e.target.value)}
      />
      <textarea
        className="ticket-textarea"
        placeholder="Beskrivning"
        value={form.desc}
        onChange={e => updateField('desc', e.target.value)}
      />
      <label>
        Prioritet:
        <select
          className="ticket-priority-select"
          value={form.priority}
          onChange={e => updateField('priority', e.target.value)}
        >
          <option value={1}>1 — Hög</option>
          <option value={2}>2 — Medium</option>
          <option value={3}>3 — Låg</option>
        </select>
      </label>
      <button type="submit" className="ticket-submit" disabled={loading}>
        {loading ? 'Skickar...' : 'Skapa ärende'}
      </button>
    </form>
  );
}
