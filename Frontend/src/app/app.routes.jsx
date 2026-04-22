import {createBrowserRouter} from 'react-router'
import Dashboard from '../features/reel/pages/Dashboard'
import SharePage from '../features/reel/pages/SharePage'


export const router = createBrowserRouter([
    {
        path: '/',
        element: <Dashboard />
    },
    {
        path: '/share',
        element: <SharePage />
    }
])