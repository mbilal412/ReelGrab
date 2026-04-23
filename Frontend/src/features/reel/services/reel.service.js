import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});

export const donwnloadReel = async (url) => {
    const response = await api.post('/api/reels/download', { url }, {
        responseType: 'blob'
    }
    );
    return response;
}