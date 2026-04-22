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

    try {
        const response = await execPromise(`yt-dlp -o "${path}" --print after_move:filepath "${url}"`);
        const filePath = response.stdout.trim();
        const fileName = basename(filePath);
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
        res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
        res.sendFile(filePath, (err) => {
            if (err) console.log(err)
            fs.unlink(filePath, (err) => {
                if (err) console.log(err)
            })
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message.includes('is not a valid URL') ? 'invalid url' : 'Error downloading the reel',

        });
    }
};

