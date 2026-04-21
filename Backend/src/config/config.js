import dotenv from 'dotenv';

dotenv.config();

if (!process.env.FRONTEND_URL) {
    throw new Error('FRONTEND_URL is not defined in environment variables');
}

export default {
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
}