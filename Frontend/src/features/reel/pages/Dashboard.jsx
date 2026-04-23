import React from 'react'
import { useState } from 'react'
import { useReel } from '../hooks/useReel'
import '../style/reel.scss'


const Dashboard = () => {
    const [url, setUrl] = useState('')
    const { handleDownload, loading, error } = useReel()

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loading) return;
        handleDownload(url);
    }


    return (
        <>
            <main className='dashboard'>
                <form action="" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder='enter url'
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <button type='submit' disabled={loading}>
                        {loading ? 'Downloading...' : 'Download'}
                    </button>
                    {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                </form>
            </main>
        </>
    )
}

export default Dashboard