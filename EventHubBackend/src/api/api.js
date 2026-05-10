import axios from "axios";

// Check if we should use mock API or real API
const USE_MOCK_API = true; // Set to false when backend is ready

const realAPI = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: false,
});

realAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

realAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "http://localhost:8080/api/auth/refresh",
          {},
          { 
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (res.status === 200) {
          const token = res.data;
          localStorage.setItem("token", token);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return realAPI(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Mock API import
import mockApi from './mockApi.js';

// Create API object that routes to mock or real API
const API = {
  get: async (url, config = {}) => {
    if (USE_MOCK_API) {
      // Route mock API calls
      if (url === '/auth/me') {
        return { data: await mockApi.getCurrentUser() };
      }
      if (url === '/events') {
        return { data: await mockApi.getEvents() };
      }
      if (url.startsWith('/events/')) {
        const eventId = url.split('/')[2];
        return { data: await mockApi.getEvent(eventId) };
      }
      if (url === '/notifications') {
        return { data: await mockApi.getNotifications() };
      }
    }
    return realAPI.get(url, config);
  },

  post: async (url, data, config = {}) => {
    if (USE_MOCK_API) {
      // Route mock API calls
      if (url === '/auth/login') {
        return { data: await mockApi.login(data) };
      }
      if (url === '/auth/register') {
        return { data: await mockApi.register(data) };
      }
      if (url === '/auth/logout') {
        return { data: await mockApi.logout() };
      }
      if (url.startsWith('/events/') && url.endsWith('/register')) {
        const eventId = url.split('/')[2];
        return { data: await mockApi.registerForEvent(eventId) };
      }
      if (url.startsWith('/events/') && data.title) {
        return { data: await mockApi.createEvent(data) };
      }
      if (url.startsWith('/notifications/') && url.endsWith('/read')) {
        const notificationId = url.split('/')[2];
        return { data: await mockApi.markNotificationAsRead(notificationId) };
      }
    }
    return realAPI.post(url, data, config);
  },

  put: async (url, data, config = {}) => {
    if (USE_MOCK_API) {
      // Handle PUT requests for mock
      if (url.startsWith('/events/')) {
        const eventId = url.split('/')[2];
        return { data: await mockApi.updateEvent(eventId, data) };
      }
      if (url.startsWith('/notifications/') && url.endsWith('/read')) {
        const notificationId = url.split('/')[2];
        return { data: await mockApi.markNotificationAsRead(notificationId) };
      }
    }
    return realAPI.put(url, data, config);
  },

  delete: async (url, config = {}) => {
    if (USE_MOCK_API) {
      // Handle DELETE requests for mock
      if (url.startsWith('/events/')) {
        const eventId = url.split('/')[2];
        return { data: await mockApi.deleteEvent(eventId) };
      }
    }
    return realAPI.delete(url, config);
  }
};

// Add other axios methods if needed
API.interceptors = realAPI.interceptors;

export default API;