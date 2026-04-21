import React from 'react'
import { useState } from 'react'
import { useReel } from '../hooks/useReel'

const Dashboard = () => {
    const [url, setUrl] = useState('')
    const { handleDownload } = useReel()

    const handleSubmit = (e) => {
        e.preventDefault();
        handleDownload(url);
    }


  return (
    <>
        <form action="" onSubmit={handleSubmit}>
            <input 
                type="text" 
                placeholder='enter url' 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />
            <button type='submit'>Download</button>
        </form>
    </>
  )
}

export default Dashboard