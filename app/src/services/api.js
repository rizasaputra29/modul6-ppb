import { BACKEND_URL } from "./config.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Fungsi helper mengambil token
async function getAuthHeaders() {
  const token = await AsyncStorage.getItem("userToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  if (!BACKEND_URL) {
    throw new Error("BACKEND_URL is not set in app.json");
  }

  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${BACKEND_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders, // Sisipkan token otomatis
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.status === 204 ? null : response.json();
}

export const Api = {
  // Update: support page & limit
  getSensorReadings(page = 1, limit = 10) {
    return request(`/api/readings?page=${page}&limit=${limit}`);
  },
  getThresholds() {
    return request("/api/thresholds");
  },
  createThreshold(payload) {
    return request("/api/thresholds", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  deleteThresholds() {
    return request("/api/thresholds", {
      method: "DELETE",
    });
  },
};