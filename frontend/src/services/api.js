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

export const getUploadSignature = async () => {
    const response = await api.get('/content/upload-signature');
    return response.data;
};

export const generateContentFromVideo = async (videoTitle, secure_url, public_id) => {
    const response = await api.post('/content/generate/video', {
        videoTitle,
        secure_url,
        public_id
    });
    return response.data;
};

export const deleteContentHistory = async (id) => {
    const response = await api.delete(`/content/history/${id}`);
    return response.data;
};

export default api;
