import API from "./api";

export const userService = {
  // Get all users (Admin/Employee only)
  getAllUsers: async (page = 0, size = 10) => {
    const response = await API.get(`/users?page=${page}&size=${size}`);
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await API.get(`/users/${id}`);
    return response.data;
  },

  // Get user by username (Admin/Employee only)
  getUserByUsername: async (username) => {
    const response = await API.get(`/users/username/${username}`);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await API.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user (Admin only)
  deleteUser: async (id) => {
    await API.delete(`/users/${id}`);
  },

  // Change user role (Admin only)
  changeUserRole: async (id, role) => {
    const response = await API.put(`/users/${id}/role`, null, {
      params: { role }
    });
    return response.data;
  },

  // Enable/disable user (Admin only)
  enableDisableUser: async (id, enabled) => {
    const response = await API.put(`/users/${id}/status`, null, {
      params: { enabled }
    });
    return response.data;
  }
};
