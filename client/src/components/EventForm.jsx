import { useState, useEffect } from "react";

export default function EventForm({ initialData, onSubmit, loading }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dateTime: "",
    location: "",
    capacity: "",
  });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        dateTime: initialData.dateTime ? initialData.dateTime.slice(0, 16) : "",
        location: initialData.location || "",
        capacity: initialData.capacity || "",
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.dateTime) newErrors.dateTime = "Date and time are required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.capacity || form.capacity < 1) newErrors.capacity = "Capacity must be at least 1";
    
    const selectedDate = new Date(form.dateTime);
    if (selectedDate <= new Date()) {
      newErrors.dateTime = "Event date must be in the future";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (image) fd.append("image", image);
    onSubmit(fd);
  };

  return (
    <form onSubmit={submit} className="bg-slate-900 p-6 rounded-xl space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          placeholder="Event title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="input"
        />
        {errors.title && <span className="text-red-500 text-xs">{errors.title}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          placeholder="Event description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows="4"
          className="input"
        />
        {errors.description && <span className="text-red-500 text-xs">{errors.description}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Date & Time</label>
        <input
          type="datetime-local"
          value={form.dateTime}
          onChange={(e) => setForm({ ...form, dateTime: e.target.value })}
          className="input"
        />
        {errors.dateTime && <span className="text-red-500 text-xs">{errors.dateTime}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <input
          placeholder="Event location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="input"
        />
        {errors.location && <span className="text-red-500 text-xs">{errors.location}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Capacity</label>
        <input
          type="number"
          placeholder="Maximum attendees"
          value={form.capacity}
          onChange={(e) => setForm({ ...form, capacity: e.target.value })}
          min="1"
          className="input"
        />
        {errors.capacity && <span className="text-red-500 text-xs">{errors.capacity}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Event Image</label>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="input" />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded disabled:opacity-50"
      >
        {loading ? "Saving..." : initialData ? "Update Event" : "Create Event"}
      </button>
    </form>
  );
}