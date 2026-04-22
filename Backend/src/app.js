import express from 'express';
import reelRouter from './routes/reel.route.js';
import cors from 'cors';
import config from './config/config.js';

const app = express();
app.use(express.json());
console.log(config.FRONTEND_URL);
app.use(cors({
    origin: config.FRONTEND_URL, // Adjust this to your frontend URL
    credentials: true
}))

app.use('/api/reels', reelRouter);

export default app;