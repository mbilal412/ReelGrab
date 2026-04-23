import { spawn } from 'child_process';
import os from 'os';
import fs from 'fs'

const progressClients = new Map();


export const getProgress = (req, res) => {
    
    console.log('SSE connected:', req.params.sessionId);
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const { sessionId } = req.params;
    console.log('SessionId received:', sessionId);
    console.log('Client found:', progressClients.has(sessionId));

    progressClients.set(sessionId, res);
    console.log('Client stored:', progressClients.has(sessionId));

    req.on('close', () => {
        progressClients.delete(sessionId);
    });
}


export const downloadReel = async (req, res) => {

    const { url, sessionId } = req.body;

    /**
     * We will use the sessionID to send progress updates to the correct client using Server-Sent Events (SSE).
     * The client will listen to the /progress endpoint with the same sessionID to receive updates.
     */

    

    if (!url || !url.includes('instagram.com')) {
        return res.status(400).json({ message: 'Invalid Instagram URL' });
    }

    /**
     * First, we need to get the title of the reel to save it with a proper name.
     * We will use yt-dlp's --get-title option to retrieve the title without downloading the video.
     */
    const titleProcess = spawn('yt-dlp', ['--get-title', url]);
    let title = '';

    titleProcess.stdout.on('data', async (data) => {
        title += await data.toString();
    });

    /**
     * Creating safe file name and using it to download the reel to the tmp/${safeTitle}.mp4 file
     */

    titleProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`yt-dlp process exited with code ${code} while getting title`);
        }
        const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const outputPath = `${os.tmpdir()}/${safeTitle}.mp4`;

        /**
         * Starting download process on the ouputpath and the provided url to save on server.
         */
        const downloadProcess = spawn('yt-dlp', ['-o', outputPath, url]);

        downloadProcess.stderr.on('data', (data) => {
            console.error(`yt-dlp error: ${data}`);
        });

        downloadProcess.stdout.on('data', (data) => {
            /**
             * Sending download progress to the client in XX% format
             */
            const client = progressClients.get(sessionId);
            const output = data.toString();
            const match = output.match(/(\d+\.?\d*)%/);
            if (match && client) {
                console.log('Progress:', match[1]);
                client.write(`data: ${match[1]}\n\n`);
            }
            console.log(`yt-dlp output: ${data}`);
        });

        /**
         * After downloadin the reel, sending the file to the client and deleting it from the server after sending.
         */

        downloadProcess.on('close', (code) => {
            if (code === 0) {
                console.log(`yt-dlp process exited with code ${code} after downloading`);
                res.download(outputPath, `${safeTitle}.mp4`, (err) => {
                    if (err) {
                        console.error(`Error sending file: ${err}`);
                    }
                    fs.unlinkSync(outputPath)
                })
            } else {
                console.error(`yt-dlp process exited with code ${code} while downloading`);
                res.status(500).json({ message: 'Failed to download reel' });

            }


        });
    });
}

