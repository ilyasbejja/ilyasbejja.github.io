/**
 * api.js — DevEarn API Client
 * Centralized API calls for the frontend
 */

const API_BASE_URL = "https://devearn-backend.onrender.com";

const api = {
  // Helpers for tokens
  getToken: () => localStorage.getItem("devearn_token"),
  setToken: (token) => localStorage.setItem("devearn_token", token),
  clearToken: () => localStorage.removeItem("devearn_token"),

  // Generic fetch wrapper
  async fetch(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Add Authorization header if token exists
    const token = this.getToken();
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    const response = await fetch(url, options);

    // Provide a standardized error output
    if (!response.ok) {
      let errorMsg = "Erreur serveur";
      try {
        const errorData = await response.json();
        errorMsg = errorData.detail || errorMsg;
      } catch (e) {
        // Not JSON
      }
      const err = new Error(errorMsg);
      err.status = response.status;
      throw err;
    }

    return response.json();
  },

  // GET request
  async get(endpoint) {
    return this.fetch(endpoint, {
      method: "GET",
    });
  },

  // POST request (JSON)
  async post(endpoint, data) {
    return this.fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },

  // Upload avatar (FormData)
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append("file", file);
    
    const url = `${API_BASE_URL}/users/me/avatar`;
    const token = this.getToken();
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
        let errorMsg = "Erreur serveur";
        try {
            const errorData = await response.json();
            errorMsg = errorData.detail || errorMsg;
        } catch (e) {}
        throw new Error(errorMsg);
    }
    return response.json();
  },

  // Special POST for OAuth2 Form (login)
  async login(email, password) {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    return this.fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });
  }
};

window.api = api;
