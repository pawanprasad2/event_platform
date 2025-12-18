import { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import { getEvents, getJoinedEvents } from "../api/event.api";
import { userDataContext } from "../context/UserContext";

export default function Dashboard() {
  const { user } = useContext(userDataContext);
  const [created, setCreated] = useState([]);
  const [joined, setJoined] = useState([]);

  useEffect(() => {
    if (!user) return;

    getEvents().then(res => {
      setCreated(res.data.filter(e => e.createdBy._id === user._id));
    });

    getJoinedEvents().then(res => setJoined(res.data));
  }, [user]);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-12">
        <section>
          <h2 className="text-xl font-semibold mb-4">My Events</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {created.map(event => (
              <EventCard key={event._id} event={event} isOwner />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Joined Events</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {joined.map(event => (
              <EventCard
                key={event._id}
                event={event}
                isOwner={false}
                isAttending={true}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
