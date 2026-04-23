import { downloadReel } from "../services/reel.service";
import { useContext } from "react";
import { ReelContext } from "../context/reelContext";

export const useReel = () => {
    const { setLoading, setError, loading, error } = useContext(ReelContext);
    const handleDownload = async (reelUrl) => {
        setLoading(true);
        setError(null);
        try {
            const response = await downloadReel(reelUrl);
            const disposition = response.headers['content-disposition'];
            const filename = disposition.split('filename=')[1].replace(/"/g, '');
            const url = window.URL.createObjectURL(response.data);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename; // Set the download attribute to the extracted filename
            a.click();
        } catch (error) {
            const errorText = await error.response.data.text();
            const errorJson = JSON.parse(errorText);
            console.log(errorJson);
            setError(errorJson.error || 'Error downloading the reel');
            throw errorJson.error || 'Error downloading the reel';
        } finally {
            setLoading(false);
        }
    };

    return {
        handleDownload, loading, error
    };
}