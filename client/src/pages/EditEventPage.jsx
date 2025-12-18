import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import EventForm from "../components/EventForm";
import { getEvents, updateEvent } from "../api/event.api";

export default function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getEvents().then(res => {
      const found = res.data.find(e => e._id === id);
      if (!found) {
        alert("Event not found");
        navigate("/");
      }
      setEvent(found);
    });
  }, [id, navigate]);

  const handleUpdate = async (formData) => {
    setLoading(true);
    try {
      await updateEvent(id, formData);
      alert("Event updated");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return (
      <div
        className="min-h-screen p-10"
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Edit Event</h1>
        <EventForm initialData={event} onSubmit={handleUpdate} loading={loading} />
      </div>
    </div>
  );
}
