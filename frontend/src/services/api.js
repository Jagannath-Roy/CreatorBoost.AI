import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    withCredentials: true,
    timeout: 60000, // 60 seconds timeout for long-running AI requests
});

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
