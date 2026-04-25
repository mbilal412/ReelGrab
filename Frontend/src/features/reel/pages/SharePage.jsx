import React from "react";
import "../style/share.scss";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { useReel } from "../hooks/useReel";

const SharePage = () => {
  const { handleDownloadReel, downloading, progress, error } = useReel();
  const [successMessage, setSuccessMessage] = useState("");
  const [searchParams] = useSearchParams();
  const url = searchParams.get("url") || searchParams.get("text");

  useEffect(() => {
      
      const downloadReel = async () => {
        setSuccessMessage("");
      try {
        await handleDownloadReel(url);
        setSuccessMessage("Download completed successfully.");
      } catch (error) {
        //
      }
    };

    if (url) {
      downloadReel();
    }
  }, [url]);

  const statusText = !url
    ? "Please open this page from Instagram share so download can start."
    : downloading
      ? "Downloading reel..."
      : successMessage || "Preparing your download...";

  return (
    <main className="share-page">
      <section className="share-card">
        <p className="share-label">Auto Download</p>
        <h2 className="share-title">Your reel download starts automatically</h2>
        <p className="screen-tip">Keep this screen active while download is in progress.</p>

        <p
          className={`share-status ${error ? "is-error" : successMessage ? "is-success" : ""}`}
        >
          {error ? `Error: ${error}` : statusText}
        </p>

        {(downloading || progress > 0) && (
          <>
            <div className="download-line">
              <div
                className="download-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="progress-text">{progress}%</p>
          </>
        )}
      </section>
    </main>
  );
};

export default SharePage;
