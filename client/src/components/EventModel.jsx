import EventForm from "./EventForm";

export default function EventModel({ onClose, onCreated }) {
  const handleCreate = async (formData) => {
    await onCreated(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div
        className="p-6 rounded-xl w-full max-w-lg"
        style={{ background: "var(--card)", color: "var(--text)" }}
      >
        <h2 className="text-xl font-semibold mb-4">Create Event</h2>

        <EventForm onSubmit={handleCreate} />

        <button
          onClick={onClose}
          style={{ color: "var(--muted)" }}
          className="mt-4 text-sm hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
