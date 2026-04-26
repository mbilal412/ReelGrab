import { spawn } from "child_process";
import os from "os";
import fs from "fs";

export const downloadReel = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: "Invalid URL" });
  }

  /**
   * First, we need to get the title of the reel to save it with a proper name.
   * We will use yt-dlp's --get-title option to retrieve the title without downloading the video.
   */
  const titleProcess = spawn("yt-dlp", ["--print", "title", url])
  let title = "";

  titleProcess.stderr.on("data", (data) => {
    console.error(`yt-dlp error: ${data}`);
  });

  titleProcess.stdout.on("data", async (data) => {
    title += await data.toString();
  });

  /**
   * Creating safe file name and using it to download the reel to the tmp/${safeTitle}.mp4 file
   */

  titleProcess.on("close", (code) => {
    if (code !== 0) {
         console.error(`yt-dlp exited with code ${code} while getting title`);
    }
    const safeTitle = title.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "video";
    const outputPath = `${os.tmpdir()}/${safeTitle}.mp4`;

    /**
     * Starting download process on the ouputpath and the provided url to save on server.
     */
    const downloadProcess = spawn("yt-dlp", ["-o", outputPath, url]);

    downloadProcess.stderr.on("data", (data) => {
      console.error(`yt-dlp error: ${data}`);
    });

    /**
     * After downloadin the reel, sending the file to the client and deleting it from the server after sending.
     */

    downloadProcess.on("close", (code) => {
      if (code === 0) {
        res.download(outputPath, `${safeTitle}.mp4`, (err) => {
          if (err) {
            return res.status(500).json({ message: "Failed to send reel" });
          }
          fs.unlink(outputPath, (err) => {
            if (err) {
                console.error(`Failed to delete file: ${err}`);
            }
          });
        });
      } else {
        res.status(500).json({ message: "Failed to download reel" });
      }
    });
  });
};
