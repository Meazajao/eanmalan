export default function TicketItem({ t, onClose }) {
  const getPriorityColor = (prio) => {
    if (prio === 1) return '#b91c1c'; // hög
    if (prio === 2) return '#fbbf24'; // medium
    return '#047857'; // låg
  };

  return (
    <li
      className={`ticket-item ${t.status === 'CLOSED' ? 'closed' : ''}`} // 🔹 rättade className
      style={{ borderLeftColor: getPriorityColor(t.priority) }}
    >
      <div className="ticket-header">
        <div>
          <div className="ticket-title">{t.title}</div>
          <div className="ticket-desc">{t.desc}</div>
          <small className="ticket-meta">
            prio {t.priority} • {t.status} •{' '}
            {new Date(t.createdAt).toLocaleString()}
          </small>
        </div>

        {t.status === 'OPEN' && (
          <button
            onClick={() => onClose(t.id)}
            className="close-btn"
          >
            Stäng ärende
          </button>
        )}
      </div>
    </li>
  );
}
