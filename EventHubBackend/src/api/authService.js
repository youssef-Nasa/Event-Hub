import API from "./api";

export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await API.post("/auth/register", userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await API.post("/auth/login", credentials);
    return response.data; // Returns JWT token
  },

  // Refresh token
  refreshToken: async () => {
    const response = await API.post("/auth/refresh");
    return response.data; // Returns new JWT token
  },

  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Get current user from token
  getCurrentUser: () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      // Decode JWT token (simple implementation)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        username: payload.sub,
        email: payload.email,
        role: payload.role
      };
    } catch (error) {
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      // Check if token is expired
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch (error) {
      return false;
    }
  },

  // Check user role
  hasRole: (requiredRole) => {
    const user = authService.getCurrentUser();
    return user && user.role === requiredRole;
  },

  // Check if user is admin
  isAdmin: () => {
    return authService.hasRole("ADMIN");
  },

  // Check if user is employee or admin
  isEmployeeOrAdmin: () => {
    const user = authService.getCurrentUser();
    return user && (user.role === "EMPLOYEE" || user.role === "ADMIN");
  }
};
