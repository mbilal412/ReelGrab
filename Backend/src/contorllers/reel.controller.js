import { exec } from 'child_process';
import { promisify } from 'util';
import { resolve } from 'path';
import fs from 'fs'

export const getReels = async (req, res) => {
    const execPromise = promisify(exec);
    const { url } = req.body

    const path = "src/media/%(title)s.%(ext)s"

    try {
        const response = await execPromise(`yt-dlp -o "${path}" "${url}"`);
        const match = response.stdout.match(/Destination: (.+)/);
        const filePath = match[1].trim();
        const fileName = filePath.split('\\').pop();
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