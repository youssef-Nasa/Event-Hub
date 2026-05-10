import API from "./api";

export const eventService = {
  // Get all events
  getAllEvents: async (page = 0, size = 10, sortBy = "eventDate") => {
    const response = await API.get(`/events?page=${page}&size=${size}&sortBy=${sortBy}`);
    return response.data;
  },

  // Get published events
  getPublishedEvents: async (page = 0, size = 10, sortBy = "eventDate") => {
    const response = await API.get(`/events/published?page=${page}&size=${size}&sortBy=${sortBy}`);
    return response.data;
  },

  // Get event by ID
  getEventById: async (id) => {
    const response = await API.get(`/events/${id}`);
    return response.data;
  },

  // Create new event (Admin/Employee only)
  createEvent: async (eventData) => {
    const response = await API.post("/events", eventData);
    return response.data;
  },

  // Update event
  updateEvent: async (id, eventData) => {
    const response = await API.put(`/events/${id}`, eventData);
    return response.data;
  },

  // Delete event
  deleteEvent: async (id) => {
    await API.delete(`/events/${id}`);
  },

  // Search events
  searchEvents: async (searchRequest) => {
    const response = await API.post("/events/search", searchRequest);
    return response.data;
  },

  // Register for event
  registerForEvent: async (eventId) => {
    const response = await API.post(`/events/${eventId}/register`);
    return response.data;
  },

  // Unregister from event
  unregisterFromEvent: async (eventId) => {
    const response = await API.delete(`/events/${eventId}/register`);
    return response.data;
  },

  // Publish event (Admin/Employee only)
  publishEvent: async (id) => {
    const response = await API.put(`/events/${id}/publish`);
    return response.data;
  },

  // Cancel event (Admin/Employee only)
  cancelEvent: async (id) => {
    const response = await API.put(`/events/${id}/cancel`);
    return response.data;
  },

  // Get events by organizer
  getEventsByOrganizer: async (organizerId, page = 0, size = 10) => {
    const response = await API.get(`/events/organizer/${organizerId}?page=${page}&size=${size}`);
    return response.data;
  },

  // Get upcoming events
  getUpcomingEvents: async () => {
    const response = await API.get("/events/upcoming");
    return response.data;
  }
};
