import { useState } from "react";

export default function TicketForm({ onCreate, loading }) {
  const [form, setForm] = useState({ title: "", desc: "", priority: 2 });
  const [error, setError] = useState("");

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: field === "priority" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const title = form.title.trim();
    const desc = form.desc.trim();

    if (!title || !desc) {
      setError("Titel och beskrivning får inte vara tomma");
      return;
    }

    setError("");
    await onCreate(form);
    setForm({ title: "", desc: "", priority: 2 });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-4 bg-white rounded-xl shadow-md border border-slate-200"
    >
      {error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">
          {error}
        </p>
      )}

      <input
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-300"
        placeholder="Titel"
        value={form.title}
        onChange={(e) => updateField("title", e.target.value)}
      />

      <textarea
        className="w-full px-4 py-2 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-300"
        placeholder="Beskriv ditt ärende"
        rows={4}
        value={form.desc}
        onChange={(e) => updateField("desc", e.target.value)}
      />

      <label className="flex items-center gap-2 text-sm text-slate-700">
        Prioritet:
        <select
          className="ml-2 px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-300"
          value={form.priority}
          onChange={(e) => updateField("priority", e.target.value)}
        >
          <option value={1}>1 — Hög</option>
          <option value={2}>2 — Medium</option>
          <option value={3}>3 — Låg</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-500 transition"
      >
        {loading ? "Skickar..." : "Skapa ärende"}
      </button>
    </form>
  );
}
