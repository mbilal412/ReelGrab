import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import ReelProvider from './features/reel/context/reelContext'


createRoot(document.getElementById('root')).render(
  
    <ReelProvider>
      <App />
    </ReelProvider>
)
