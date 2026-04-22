import { exec } from 'child_process';
import { promisify } from 'util';
import { resolve, basename } from 'path';
import fs from 'fs'

export const getReels = async (req, res) => {
    const execPromise = promisify(exec);
    const { url } = req.body
    if (!url) {
        return res.status(400).send({
            message: "URL is required"
        })
    }

    const path = "src/media/%(title)s.%(ext)s"

    try {
        const response = await execPromise(`yt-dlp -o "${path}" "${url}"`);
        console.log("STDOUT:", response.stdout);
        console.log("STDERR:", response.stderr);
        const match = response.stdout.match(/Destination: (.+)/);
        console.log("MATCH:", match);
        const filePath = match[1].trim();
        const fileName = basename(filePath);
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
        res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
        res.sendFile(resolve(filePath), (err) => {
            if (err) console.log(err)
            fs.unlink(filePath, (err) => {
                if (err) console.log(err)
            })
        })

    } catch (error) {
        res.status(500).send({
            message: error.message.includes('is not a valid URL') ? 'invalid url' : 'Error downloading the reel',

        });
    }
};

