import TicketItem from './TicketItem';

export default function TicketList({ tickets }) {
  if (!tickets.length) {
    return <p>Inga ärenden ännu.</p>;
  }

  return (
    <ul className="ticket-list">
      {tickets.map(t => <TicketItem key={t.id} t={t} />)}
    </ul>
  );
}
