import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user?.accessToken) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = JSON.parse(localStorage.getItem('user') || '{}')?.refreshToken;
        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}/users/refreshtoken`,
            { refreshToken },
            { withCredentials: true }
          );

          if (response.data.success) {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.accessToken = response.data.accessToken;
            user.refreshToken = response.data.refreshToken;
            localStorage.setItem('user', JSON.stringify(user));

            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  logout: () => api.post('/users/logout'),
  refreshToken: (refreshToken) => api.post('/users/refreshtoken', { refreshToken }),
  getCurrentUser: () => api.get('/users/me'),
};

// Blog API
export const blogAPI = {
  getPublicBlogs: () => api.get('/blogs/public'),
  getBlogById: (blogId) => api.get(`/blogs/${blogId}`),
  getUserBlogs: () => api.get('/blogs'),
  createBlog: (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    if (data.coverImage) {
      formData.append('coverImage', data.coverImage);
    }
    return api.post('/blogs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  updateBlog: (blogId, data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    if (data.coverImage) {
      formData.append('coverImage', data.coverImage);
    }
    return api.put(`/blogs/${blogId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteBlog: (blogId) => api.delete(`/blogs/${blogId}`),
};

// Reaction API
export const reactionAPI = {
  like: (blogId) => api.post(`/blogs/${blogId}/like`),
  removeLike: (blogId) => api.delete(`/blogs/${blogId}/like`),
  dislike: (blogId) => api.post(`/blogs/${blogId}/dislike`),
  removeDislike: (blogId) => api.delete(`/blogs/${blogId}/dislike`),
  getReactionStatus: (blogId) => api.get(`/blogs/${blogId}/reactions`),
  getPublicReactionCounts: (blogId) => {
    // Create a separate axios instance without auth for public endpoint
    return axios.get(`${API_BASE_URL}/blogs/${blogId}/reactions/public`, {
      withCredentials: true,
    });
  },
};

// Comment API
export const commentAPI = {
  getComments: (blogId) => api.get(`/blogs/${blogId}/comments`),
  getCommentCount: (blogId) => api.get(`/blogs/${blogId}/comments-count`),
  createComment: (blogId, content) => api.post(`/blogs/${blogId}/comments`, { content }),
  updateComment: (commentId, content) => api.put(`/comments/${commentId}`, { content }),
  deleteComment: (commentId) => api.delete(`/comments/${commentId}`),
};

export default api;

