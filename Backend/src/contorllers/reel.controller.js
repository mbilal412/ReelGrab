import { exec } from 'child_process';
import { promisify } from 'util';
import { resolve, basename, dirname } from 'path';
import fs from 'fs'
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getReels = async (req, res) => {
    const execPromise = promisify(exec);
    const { url } = req.body
    if (!url) {
        return res.status(400).send({
            message: "URL is required"
        })
    }

    const mediaDir = resolve(__dirname, '../media');
    const path = `${mediaDir}/%(title)s.%(ext)s`;

    req.on('aborted', () => {
        console.log("CLIENT ABORTED REQUEST");
    });
    req.on('aborted', () => {
        console.log("CLIENT ABORTED REQUEST");
    });

    res.on('close', () => {
        console.log("RESPONSE CLOSED");
    });
    try {
        const response = await execPromise(`yt-dlp -o "${path}" "${url}"`, {
            timeout: 0 // Set a timeout of 60 seconds
        });
        let match = response.stdout.match(/Merging formats into "(.+)"/);
        if (!match) {
            match = response.stdout.match(/Destination: (.+)/);
        }
        if (!match) {
            throw new Error('Could not determine the downloaded file path');
        }
        const filePath = match[1].trim();
        const fileName = basename(filePath);

        const stream = fs.createReadStream(filePath);
        res.setHeader('Content-Disposition', `attachment; filename="${basename(filePath)}"`);
        res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

        stream.pipe(res);

        stream.on('end', () => {
            fs.unlink(filePath, () => { });
        });

        stream.on('error', (err) => {
            console.log("STREAM ERROR:", err);
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message.includes('is not a valid URL') ? 'invalid url' : 'Error downloading the reel',

        });
    }
};

