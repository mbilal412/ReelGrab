// import axios from 'axios';

// const api = axios.create({
//     baseURL: import.meta.env.VITE_BACKEND_URL,
// });

export const donwnloadReel = async (url, onProgress) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/reels/download`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to download reel");
  }

  const disposition = response.headers.get("content-disposition");
  const filename =
    disposition?.split("filename=")[1]?.replace(/"/g, "") || "reel.mp4";

  const reader = response.body.getReader();
  const contentLength = response.headers.get("Content-Length");
  let receivedLength = 0;
  let chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    receivedLength += value.length;
    const percent = (receivedLength / contentLength) * 100;
    onProgress(percent.toFixed(0));
  }

  return { blob: new Blob(chunks), filename };
};
