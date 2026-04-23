import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});

export const donwnloadReel = async (url, sessionId) => {
    const response = await api.post('/api/reels/download', { url, sessionId }, {
        responseType: 'blob'
    }
    );
    return response;
}

export const getDownloadProgress = (sessionID, onProgress) => {
    const eventSource = new EventSource(`${import.meta.env.VITE_BACKEND_URL}/api/reels/progress/${sessionID}`);
    eventSource.onmessage = (event) => {
        console.log(parseFloat(event.data));
        onProgress(parseFloat(event.data));
    };

    return eventSource;
}