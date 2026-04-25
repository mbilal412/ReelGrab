import { donwnloadReel } from "../services/reel.service";
import { useContext } from "react";
import { ReelContext } from "../context/ReelContext";

export const useReel = () => {
  const {
    downloading,
    setDownloading,
    progress,
    setProgress,
    error,
    setError,
  } = useContext(ReelContext);

  const handleDownloadReel = async (url) => {
    setDownloading(true);
    setError(null);
    try {
      const response = await donwnloadReel(url, (progress) => {
        setProgress(progress);
      });

      const { blob, filename } = response;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch (err) {
      console.error(err);
      setError(err.message || "errror");
    } finally {
      setDownloading(false);
      setProgress(0);
    }
  };

  return {
    handleDownloadReel,
    progress,
    downloading,
    error,
  };
};
