import { donwnloadReel } from "../services/reel.service";
import { useContext } from "react";
import { ReelContext } from "../context/ReelContext";

export const useReel = () => {
    const { loading, error, setLoading, setError } = useContext(ReelContext);

    const handleDownloadReel = async (url) => {
        setLoading(true);
        setError(null);
        try {
            const response = await donwnloadReel(url);
            const disposition = response.headers['content-disposition'];
            const filename = disposition?.split('filename=')[1]?.replace(/"/g, '') || 'reel.mp4';

            const blob = new Blob([response.data]);
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();

        }
        catch (err) {
            const text = await err?.response?.data?.text();
            const error = JSON.parse(text);
            setError(error.message || 'Failed to download reel');
        }finally{
            setLoading(false);``
        }
    }
    
    return {
        handleDownloadReel,
        loading,
        error
    }

}