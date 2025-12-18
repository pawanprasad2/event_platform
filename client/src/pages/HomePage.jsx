import { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import { getEvents, deleteEvent, getJoinedEvents } from "../api/event.api";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";

export default function HomePage() {
  const { user } = useContext(userDataContext);
  const [events, setEvents] = useState([]);
  const [attendingEventIds, setAttendingEventIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredEvents = events.filter((event) =>
    `${event.title} ${event.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await getEvents();
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!user) return;
    getJoinedEvents().then((res) =>
      setAttendingEventIds(res.data.map((e) => e._id))
    );
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleEdit = (event) => {
    navigate(`/events/${event._id}/edit`);
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Upcoming Events</h1>
          <SearchBar value={search} onChange={setSearch} />
        </div>
        {loading ? (
          <div className="text-center" style={{ color: "var(--muted)" }}>
            Loading events...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center" style={{ color: "var(--muted)" }}>
            No events found
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                isOwner={user && event.createdBy._id === user._id}
                isAttending={attendingEventIds.includes(event._id)}
                userId={user?._id}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onRsvpChange={fetchEvents}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
