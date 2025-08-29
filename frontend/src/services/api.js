import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// YouTube API endpoints
export const youtubeApi = {
  // Get trending videos
  getTrending: async (category = 'all', region = 'US', maxResults = 50) => {
    const response = await api.get('/api/youtube/trending', {
      params: { category, region, max_results: maxResults }
    });
    return response.data;
  },

  // Search YouTube videos
  searchVideos: async (query, maxResults = 25) => {
    const response = await api.get('/api/youtube/search', {
      params: { query, max_results: maxResults }
    });
    return response.data;
  },

  // Get channel statistics
  getChannelStats: async (channelId) => {
    const response = await api.get(`/api/youtube/channel/${channelId}`);
    return response.data;
  },
};

// Content generation API
export const contentApi = {
  // Generate AI-powered content ideas
  generateIdeas: async (topic, category = 'general', count = 5) => {
    const response = await api.post('/api/content/generate-ideas', {
      topic,
      category,
      count
    });
    return response.data;
  },
};

// Analytics API
export const analyticsApi = {
  // Get dashboard analytics
  getDashboardAnalytics: async () => {
    const response = await api.get('/api/analytics/dashboard');
    return response.data;
  },
};

// Channel management API
export const channelsApi = {
  // Connect a YouTube channel
  connectChannel: async (channelData) => {
    const response = await api.post('/api/channels/connect', channelData);
    return response.data;
  },

  // Get all connected channels
  getConnectedChannels: async () => {
    const response = await api.get('/api/channels');
    return response.data;
  },

  // Set primary channel
  setPrimaryChannel: async (channelId) => {
    const response = await api.put(`/api/channels/${channelId}/primary`);
    return response.data;
  },

  // Disconnect a channel
  disconnectChannel: async (channelId) => {
    const response = await api.delete(`/api/channels/${channelId}`);
    return response.data;
  },
};

// Status API (existing)
export const statusApi = {
  getStatus: async () => {
    const response = await api.get('/api/status');
    return response.data;
  },

  createStatus: async (clientName) => {
    const response = await api.post('/api/status', { client_name: clientName });
    return response.data;
  },
};

export default api;