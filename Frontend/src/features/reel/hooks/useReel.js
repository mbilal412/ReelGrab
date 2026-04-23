import { donwnloadReel, getDownloadProgress } from "../services/reel.service";
import { useContext } from "react";
import { ReelContext } from "../context/ReelContext.jsx";

export const useReel = () => {
    const { downloading, setDownloading, progress, setProgress, error, setError } = useContext(ReelContext);

    const handleDownloadReel = async (url) => {
        const sessionId = crypto.randomUUID();
        setDownloading(true);
        setError(null);
        try {
            const eventSource = getDownloadProgress(sessionId, (progress) => {
                setProgress(progress);
            });
            const response = await donwnloadReel(url, sessionId);
            const disposition = response.headers['content-disposition'];
            const filename = disposition?.split('filename=')[1]?.replace(/"/g, '') || 'reel.mp4';

            const blob = new Blob([response.data]);
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            eventSource.close();

        }
        catch (err) {
            const text = await err?.response?.data?.text();
            const error = JSON.parse(text);
            setError(error.message || 'Failed to download reel');
        }finally{
            setDownloading(false);
            setProgress(0);
        }
    }
    
    return {
        handleDownloadReel,
        progress,
        downloading,
        error
    }

}