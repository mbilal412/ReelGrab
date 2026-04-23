import express from 'express';
import { downloadReel } from '../contorllers/reel.controller.js';
const reelRouter = express.Router();

reelRouter.post('/download', downloadReel);

export default reelRouter;