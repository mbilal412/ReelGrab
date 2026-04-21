import { downloadReel } from "../services/reel.service";

export const useReel = () => {
    const handleDownload = async (reelUrl) => {
        try {
            const response = await downloadReel(reelUrl);
            const disposition = response.headers['content-disposition'];
            const filename = disposition.split('filename=')[1].replace(/"/g, '');
            const url = window.URL.createObjectURL(response.data);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename; // Set the download attribute to the extracted filename
            a.click();
            console.log('Reel downloaded successfully');
        } catch (error) {
            console.error('Error downloading reel:', error);
        }
    };

    return {
        handleDownload,
    };
}