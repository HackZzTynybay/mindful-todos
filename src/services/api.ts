
import axios from "axios";

// Use environment variable with fallback to the production Render URL
const API_URL = import.meta.env.VITE_API_URL || "https://mindful-todos.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  register: (userData: { name: string; email: string; password: string }) => 
    api.post("/users/register", userData),
  
  login: (userData: { email: string; password: string }) => 
    api.post("/users/login", userData),
  
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);
    return null;
  }
};

// Todo services
export const todoService = {
  getAllTodos: () => api.get("/todos"),
  
  createTodo: (todoData: { title: string; description?: string; category?: string }) => 
    api.post("/todos", todoData),
  
  updateTodo: (id: string, todoData: { 
    title?: string; 
    description?: string; 
    completed?: boolean;
    category?: string;
  }) => api.put(`/todos/${id}`, todoData),
  
  deleteTodo: (id: string) => api.delete(`/todos/${id}`),
};

export default api;
