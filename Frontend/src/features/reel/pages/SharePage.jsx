import React from 'react'
import '../style/share.scss'
import { useSearchParams } from 'react-router'
import { useEffect, useState } from 'react';
import { } from 'react';
import { useReel } from '../hooks/useReel';

const SharePage = () => {
    const { handleDownload, error } = useReel();
    const [successMessage, setSuccessMessage] = useState('');
    const [searchParams] = useSearchParams();
    const url = searchParams.get('url');
    useEffect(() => {
        setSuccessMessage('');
        const downloadReel = async () => {
            try {
                await handleDownload(url)
                setSuccessMessage('Reel downloaded successfully!');
                window.location.href = 'instagram://';
            } catch (error) {
                //
            }
        }
        if (url) {
            downloadReel();
        }
    }, [url]);


    return (
        <main>
            {successMessage
                ? <h3 style={{ color: 'green' }}>{successMessage}</h3>
                : <h2>Downloading...</h2>
            }
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        </main>
    )
}

export default SharePage