import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    withCredentials: true,
    timeout: 60000, // 60 seconds timeout for long-running AI requests
});

// Automatically handle 401 Unauthorized errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // The backend rejected our cookie (or it's missing). Clear the fake local state.
            localStorage.removeItem('user');
            // Only redirect if we aren't already on the login or register page
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const generateContentFromVideo = async (videoTitle, file) => {
    const formData = new FormData();
    if (videoTitle) formData.append('videoTitle', videoTitle);
    formData.append('video', file);

    const response = await api.post('/content/generate/video', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export default api;
