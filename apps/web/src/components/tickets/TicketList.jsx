import TicketItem from './TicketItem';

export default function TicketList({ tickets = [], onClose }) {
  if (!tickets || tickets.length === 0) {
    return (
      <div className="p-4 text-center text-slate-600">
        Inga ärenden ännu.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {tickets.map((t) => (
        <TicketItem key={t.id} ticket={t} onClose={onClose} />
      ))}
    </ul>
  );
}
