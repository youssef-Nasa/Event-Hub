// Mock API for React Frontend - Works without backend
const mockUsers = [
  {
    id: 1,
    email: "admin@eventhub.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    role: "Admin",
    permissions: ["manage_users", "manage_events", "manage_system"]
  },
  {
    id: 2,
    email: "organizer@eventhub.com",
    password: "organizer123",
    firstName: "Event",
    lastName: "Organizer",
    role: "Organizer",
    permissions: ["create_events", "manage_events"]
  },
  {
    id: 3,
    email: "user@eventhub.com",
    password: "user123",
    firstName: "Regular",
    lastName: "User",
    role: "User",
    permissions: ["view_events", "register_events"]
  }
];

const mockEvents = [
  {
    id: 1,
    title: "Tech Conference 2024",
    description: "Annual technology conference featuring latest innovations",
    date: "2024-12-15",
    location: "Cairo Convention Center",
    organizerId: 2,
    organizerName: "Event Organizer",
    price: 299,
    category: "Technology",
    image: "https://images.unsplash.com/photo-1540575167068-5bb285a284d7?w=800",
    registered: 245,
    capacity: 500
  },
  {
    id: 2,
    title: "Music Festival",
    description: "Live music performances by top artists",
    date: "2024-12-20",
    location: "Al-Azhar Park",
    organizerId: 2,
    organizerName: "Event Organizer",
    price: 150,
    category: "Entertainment",
    image: "https://images.unsplash.com/photo-1459749411171-048521aade87?w=800",
    registered: 1200,
    capacity: 2000
  }
];

const mockNotifications = [
  {
    id: 1,
    userId: 3,
    type: "event_reminder",
    message: "Tech Conference 2024 is starting tomorrow!",
    timestamp: "2024-12-14T10:00:00Z",
    isRead: false
  },
  {
    id: 2,
    userId: 3,
    type: "event_registered",
    message: "You successfully registered for Music Festival",
    timestamp: "2024-12-10T15:30:00Z",
    isRead: true
  }
];

// Mock API functions
const mockApi = {
  // Auth endpoints
  login: async (credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(u => 
          u.email.toLowerCase() === credentials.Email.toLowerCase() && 
          u.password === credentials.Password
        );
        
        if (user) {
          const { password, ...userWithoutPassword } = user;
          resolve({
            token: `mock_token_${user.id}_${Date.now()}`,
            user: userWithoutPassword
          });
        } else {
          reject({
            response: {
              data: { message: "Invalid email or password" }
            }
          });
        }
      }, 1000);
    });
  },

  register: async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = mockUsers.find(u => u.email === userData.email);
        if (existingUser) {
          reject({
            response: {
              data: { message: "Email already registered" }
            }
          });
        } else {
          const newUser = {
            id: mockUsers.length + 1,
            ...userData,
            role: "User",
            permissions: ["view_events", "register_events"]
          };
          mockUsers.push(newUser);
          const { password, ...userWithoutPassword } = newUser;
          resolve({
            token: `mock_token_${newUser.id}_${Date.now()}`,
            user: userWithoutPassword
          });
        }
      }, 1000);
    });
  },

  getCurrentUser: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock current user - in real app this would validate token
        resolve(mockUsers[2]); // Return regular user by default
      }, 500);
    });
  },

  logout: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: "Logged out successfully" });
      }, 500);
    });
  },

  // Event endpoints
  getEvents: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockEvents);
      }, 500);
    });
  },

  getEvent: async (eventId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const event = mockEvents.find(e => e.id === parseInt(eventId));
        if (event) {
          resolve(event);
        } else {
          reject({
            response: {
              data: { message: "Event not found" }
            }
          });
        }
      }, 500);
    });
  },

  createEvent: async (eventData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEvent = {
          id: mockEvents.length + 1,
          ...eventData,
          registered: 0,
          organizerId: 2,
          organizerName: "Event Organizer"
        };
        mockEvents.push(newEvent);
        resolve(newEvent);
      }, 1000);
    });
  },

  registerForEvent: async (eventId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const event = mockEvents.find(e => e.id === parseInt(eventId));
        if (event) {
          if (event.registered < event.capacity) {
            event.registered += 1;
            resolve({ message: "Successfully registered for event" });
          } else {
            reject({
              response: {
                data: { message: "Event is full" }
              }
            });
          }
        } else {
          reject({
            response: {
              data: { message: "Event not found" }
            }
          });
        }
      }, 1000);
    });
  },

  // Notification endpoints
  getNotifications: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockNotifications);
      }, 500);
    });
  },

  markNotificationAsRead: async (notificationId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notification = mockNotifications.find(n => n.id === parseInt(notificationId));
        if (notification) {
          notification.isRead = true;
        }
        resolve({ message: "Notification marked as read" });
      }, 500);
    });
  }
};

export default mockApi;
