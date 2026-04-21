import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

export const downloadReel = async (reelUrl) => {
    const response = await api.post('/api/reels/download', 
        { url: reelUrl },
        { responseType: 'blob' }
    );
    return response;
}