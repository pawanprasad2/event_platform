import api from "../lib/axios";

export const getEvents = () => api.get("/events");
export const getEventById = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post("/events", data, {
  headers: { "Content-Type": "multipart/form-data" }
});
export const updateEvent = (id, data) => api.put(`/events/${id}`, data, {
  headers: { "Content-Type": "multipart/form-data" }
});
export const deleteEvent = (id) => api.delete(`/events/${id}`);
export const joinEvent = (id) => api.post(`/rsvp/${id}/join`);
export const leaveEvent = (id) => api.delete(`/rsvp/${id}/leave`);
export const getJoinedEvents = () => api.get("/rsvp/my");
