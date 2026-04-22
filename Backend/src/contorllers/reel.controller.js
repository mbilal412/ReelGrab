import { exec } from 'child_process';
import { promisify } from 'util';
import { resolve, basename } from 'path';
import fs from 'fs'

const execPromise = promisify(exec);
const outputTemplate = 'src/media/%(title)s.%(ext)s';

const getDownloadedFilePath = (stdout = '') => {
    const destinationMatch = stdout.match(/Destination: (.+)/);
    if (destinationMatch?.[1]) {
        return destinationMatch[1].trim();
    }

    const alreadyDownloadedMatch = stdout.match(/\[download\]\s(.+)\shas already been downloaded/);
    if (alreadyDownloadedMatch?.[1]) {
        return alreadyDownloadedMatch[1].trim();
    }

    return null;
};

export const getReels = async (req, res) => {
    const { url } = req.body ?? {};

    if(!url) {
        return res.status(400).send({
            message: 'URL is required',
            stage: 'input_validation'
        });
    }

    try {
        new URL(url);
    } catch {
        return res.status(400).send({
            message: 'invalid url',
            stage: 'url_format_validation'
        });
    }

    try {
        await fs.promises.mkdir(resolve('src/media'), { recursive: true });
    } catch (error) {
        return res.status(500).send({
            message: 'Unable to create media folder',
            stage: 'media_folder_creation',
            details: error.message
        });
    }

    let absoluteFilePath = null;
    let fileName = null;

    try {
        const response = await execPromise(`python3 -m yt_dlp -o "${outputTemplate}" "${url}"`);
        const downloadedFilePath = getDownloadedFilePath(response.stdout);

        if (!downloadedFilePath) {
            return res.status(500).send({
                message: 'Could not detect downloaded file path',
                stage: 'download_path_parsing',
                details: response.stderr || response.stdout || 'yt-dlp output did not include destination path'
            });
        }

        absoluteFilePath = resolve(downloadedFilePath);
        fileName = basename(absoluteFilePath);

    } catch (error) {
        const errorOutput = error.stderr || error.message || 'Unknown download error';
        const isInvalidUrl = /not a valid URL|Invalid URL|Unsupported URL/i.test(errorOutput);

        return res.status(isInvalidUrl ? 400 : 500).send({
            message: isInvalidUrl ? 'invalid url' : 'Error downloading the reel',
            stage: 'download_execution',
            details: errorOutput
        });
    }

    try {
        await fs.promises.access(absoluteFilePath, fs.constants.F_OK);
    } catch (error) {
        return res.status(500).send({
            message: 'Downloaded file not found on server',
            stage: 'download_file_access',
            details: error.message
        });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    res.sendFile(absoluteFilePath, async (error) => {
        if (error) {
            if (!res.headersSent) {
                return res.status(500).send({
                    message: 'Failed to send file',
                    stage: 'file_send',
                    details: error.message
                });
            }

            console.error('File send error:', error.message);
            return;
        }

        try {
            await fs.promises.unlink(absoluteFilePath);
        } catch (cleanupError) {
            console.error('Temporary file cleanup failed:', cleanupError.message);
        }
    });
};


// res.status(200).send({
//     message: "Reel downloaded successfully",
//     response: response,
//     filePath: filePath
// });