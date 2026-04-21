import express from 'express';
import reelRouter from './routes/reel.route.js';

const app = express();
app.use(express.json());

app.use('/api/reels', reelRouter);

export default app;