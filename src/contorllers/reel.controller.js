import { exec } from 'child_process';
import { promisify } from 'util';
import {resolve} from 'path';

export const getReels = async (req, res) => {
    const execPromise = promisify(exec);
    const { url } = req.body

    const path = "src/media/%(title)s.%(ext)s"

    try {
        const response = await execPromise(`yt-dlp -o "${path}" "${url}"`);
        const match = response.stdout.match(/Destination: (.+)/);
        const filePath = match[1].trim();
        res.sendFile(resolve(filePath));
    } catch (error) {
        res.status(500).send({
            message: "Error downloading the reel",
            error: error.message
        });
    }
};


// res.status(200).send({
        //     message: "Reel downloaded successfully",
        //     response: response,
        //     filePath: filePath
        // });