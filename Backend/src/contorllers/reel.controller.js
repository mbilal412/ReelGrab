import { spawn } from 'child_process';
export const downloadReel = async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const process = spawn('yt-dlp', ['-o', 'src/media/%(title)s.%(ext)s', url])

    process.stderr.on('data', (data) => {
        console.error(`stdError: ${data}`);
    });

    process.stdout.on('data', (data) => {
        console.log(`stdOut: ${data}`);
    });

    process.on('close', (code) => {
        if (code !== 0) {
            console.error(`yt-dlp process exited with code ${code}`);
            return res.status(500).json({ message: 'Failed to download the reel' });
        }
        console.log(`Process exited with code ${code}`);
        res.status(200).json({ message: 'Reel downloaded successfully' });
    });
}