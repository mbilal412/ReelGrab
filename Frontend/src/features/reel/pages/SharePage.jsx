import React from 'react'
import '../style/share.scss'
import { useSearchParams } from 'react-router'
import { useEffect, useState } from 'react';
import { useReel } from '../hooks/useReel';

const SharePage = () => {
    const { handleDownloadReel, downloading, progress, error } = useReel();
    const [successMessage, setSuccessMessage] = useState('');
    const [searchParams] = useSearchParams();
    const reelUrl = searchParams.get('url') || searchParams.get('text');

    useEffect(() => {
        setSuccessMessage('');

        const downloadReel = async () => {
            try {
                await handleDownloadReel(reelUrl)
                setSuccessMessage('Download completed successfully.');
            } catch (error) {
                //
            }
        };

        if (reelUrl) {
            downloadReel();
        }
    }, [reelUrl]);

    const statusText = !reelUrl
        ? 'Please open this page from Instagram share so download can start.'
        : downloading
            ? 'Downloading reel...'
            : successMessage || 'Preparing your download...';


    return (
        <main className='share-page'>
            <section className='share-card'>
                <p>reelUrl: {reelUrl}</p>
                <p>{url || 'URL nahi mila'}</p>
                <p>All params: {window.location.search}</p>
                <p className='share-label'>Auto Download</p>
                <h2 className='share-title'>Your reel download starts automatically</h2>

                <p className={`share-status ${error ? 'is-error' : successMessage ? 'is-success' : ''}`}>
                    {error ? `Error: ${error}` : statusText}
                </p>

                {(downloading || progress > 0) && (
                    <>
                        <div className='download-line'>
                            <div className='download-fill' style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className='progress-text'>{progress}%</p>

                    </>
                )}
            </section>
        </main>
    )
}

export default SharePage