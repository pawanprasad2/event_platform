import { useState } from "react";
import { joinEvent, leaveEvent } from "../api/event.api";
import { Trash2, Edit2, UserPlus, UserMinus } from "lucide-react";

const EventCard = ({ event, isOwner, isAttending, onEdit, onDelete, onRsvpChange, userId }) => {
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    setLoading(true);
    try {
      await joinEvent(event._id);
      onRsvpChange?.();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to join event");
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async () => {
    setLoading(true);
    try {
      await leaveEvent(event._id);
      onRsvpChange?.();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to leave event");
    } finally {
      setLoading(false);
    }
  };

  const isFull = event.attendeesCount >= event.capacity;

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden hover:shadow-xl transition">
      {event.imageUrl && (
        <img src={event.imageUrl} className="h-44 w-full object-cover" alt={event.title} />
      )}

      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-lg text-white">{event.title}</h3>
        <p className="text-sm text-slate-400 line-clamp-2">{event.description}</p>

        <div className="text-xs text-slate-300 space-y-1">
          <div>📍 {event.location}</div>
          <div>🕒 {new Date(event.dateTime).toLocaleString()}</div>
          <div>👥 {event.attendeesCount}/{event.capacity} attendees</div>
        </div>

        <div className="pt-3 space-y-2">
          {isOwner ? (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit?.(event)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded py-2 flex items-center justify-center gap-2 text-sm"
              >
                <Edit2 size={16} /> Edit
              </button>
              <button
                onClick={() => onDelete(event._id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded py-2 flex items-center justify-center gap-2 text-sm"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          ) : (
            <button
              onClick={isAttending ? handleLeave : handleJoin}
              disabled={loading || (isFull && !isAttending)}
              className={`w-full rounded py-2 flex items-center justify-center gap-2 text-sm font-semibold transition ${
                isAttending
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : isFull
                  ? "bg-gray-600 cursor-not-allowed text-gray-300"
                  : "bg-teal-600 hover:bg-teal-700 text-white"
              }`}
            >
              {loading ? (
                "Loading..."
              ) : isAttending ? (
                <>
                  <UserMinus size={16} /> Leave Event
                </>
              ) : isFull ? (
                "Event Full"
              ) : (
                <>
                  <UserPlus size={16} /> Join Event
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;