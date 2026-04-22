import { exec } from 'child_process';
import { promisify } from 'util';
import { resolve, basename } from 'path';
import fs from 'fs'

const execPromise = promisify(exec);
const MEDIA_DIR = resolve('src/media');
const OUTPUT_TEMPLATE = 'src/media/%(title)s.%(ext)s';

const parseDownloadedFilePath = (stdout = '') => {
    const destinationMatch = stdout.match(/Destination:\s(.+)/);
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
        await fs.promises.mkdir(MEDIA_DIR, { recursive: true });
    } catch (error) {
        return res.status(500).send({
            message: 'Unable to prepare media directory',
            stage: 'media_directory_creation',
            details: error.message
        });
    }

    let absoluteFilePath;

    try {
        const { stdout, stderr } = await execPromise(`python3 -m yt_dlp -o "${OUTPUT_TEMPLATE}" "${url}"`);
        const downloadedPath = parseDownloadedFilePath(stdout);

        if (!downloadedPath) {
            return res.status(500).send({
                message: 'Could not parse downloaded file path',
                stage: 'download_path_parsing',
                details: stderr || stdout || 'yt-dlp output did not include destination path'
            });
        }

        absoluteFilePath = resolve(downloadedPath);

    } catch (error) {
        const details = error.stderr || error.message || 'Unknown yt-dlp error';
        const isInvalidUrl = /not a valid URL|Invalid URL|Unsupported URL/i.test(details);
        const isMissingYtDlp = /python3: not found|No module named yt_dlp|is not recognized/i.test(details);

        return res.status(isInvalidUrl ? 400 : 500).send({
            message: isMissingYtDlp
                ? 'yt-dlp is not installed on server'
                : isInvalidUrl
                    ? 'invalid url'
                    : 'Error downloading the reel',
            stage: 'download_execution',
            details
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

    const fileName = basename(absoluteFilePath);

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

