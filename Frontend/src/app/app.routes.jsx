import {createBrowserRouter} from 'react-router'
import Dashboard from '../features/reel/pages/Dashboard'


export const router = createBrowserRouter([
    {
        path: '/',
        element: <Dashboard />
    }
])