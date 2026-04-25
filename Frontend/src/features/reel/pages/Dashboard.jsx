import React from "react";
import { useState } from "react";
import { useReel } from "../hooks/useReel";
import "../style/reel.scss";

const Dashboard = () => {
  const [url, setUrl] = useState("");
  const { handleDownloadReel, downloading, error, progress } = useReel();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (downloading) return;
    handleDownloadReel(url);
  };

  return (
    <>
      <main className="dashboard">
        <form action="" onSubmit={handleSubmit} className="download-form">
          <p className="screen-tip">
            Keep this screen active while download is in progress.
          </p>

          <div className="download-row">
            <input
              type="text"
              placeholder="Enter url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button type="submit" disabled={downloading}>
              {downloading ? "Downloading..." : "Download"}
            </button>
          </div>

          {(downloading || progress > 0) && (
            <div className="download-line">
              <div
                className="download-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          {(downloading || progress > 0) && (
            <p className="progress-text">{progress}%</p>
          )}

          {error && <p className="error-text">Error: {error}</p>}
        </form>
      </main>
    </>
  );
};

export default Dashboard;
