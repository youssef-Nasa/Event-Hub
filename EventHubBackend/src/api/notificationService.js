import API from "./api";

export const notificationService = {
  // Get user notifications
  getUserNotifications: async (userId, page = 0, size = 10) => {
    const response = await API.get(`/notifications/user/${userId}?page=${page}&size=${size}`);
    return response.data;
  },

  // Get notifications by status
  getNotificationsByStatus: async (userId, status, page = 0, size = 10) => {
    const response = await API.get(`/notifications/user/${userId}/status/${status}?page=${page}&size=${size}`);
    return response.data;
  },

  // Get recent notifications
  getRecentNotifications: async (userId) => {
    const response = await API.get(`/notifications/user/${userId}/recent`);
    return response.data;
  },

  // Get unread count
  getUnreadCount: async (userId) => {
    const response = await API.get(`/notifications/user/${userId}/unread-count`);
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await API.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (userId) => {
    await API.put(`/notifications/user/${userId}/read-all`);
  },

  // Archive notification
  archiveNotification: async (notificationId) => {
    const response = await API.put(`/notifications/${notificationId}/archive`);
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    await API.delete(`/notifications/${notificationId}`);
  },

  // Create notification (Admin/Employee only)
  createNotification: async (notificationData) => {
    const response = await API.post("/notifications", notificationData);
    return response.data;
  },

  // Create event registration notification (Admin/Employee only)
  createEventRegistrationNotification: async (userId, eventTitle, eventId) => {
    const response = await API.post("/notifications/event-registration", null, {
      params: { userId, eventTitle, eventId }
    });
    return response.data;
  },

  // Create event reminder notification (Admin/Employee only)
  createEventReminderNotification: async (userId, eventTitle, eventId) => {
    const response = await API.post("/notifications/event-reminder", null, {
      params: { userId, eventTitle, eventId }
    });
    return response.data;
  },

  // Create event cancellation notification (Admin/Employee only)
  createEventCancellationNotification: async (userId, eventTitle, eventId) => {
    const response = await API.post("/notifications/event-cancellation", null, {
      params: { userId, eventTitle, eventId }
    });
    return response.data;
  }
};
