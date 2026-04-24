import express from 'express';
import { downloadReel, getProgress } from '../contorllers/reel.controller.js';
const reelRouter = express.Router();

reelRouter.post('/download', downloadReel);
reelRouter.get('/progress/:sessionId', getProgress)
reelRouter.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

export default reelRouter;