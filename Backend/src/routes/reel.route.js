import express from 'express';
import { getReels } from '../contorllers/reel.controller.js';
const reelRouter = express.Router();

reelRouter.post('/download', getReels);

export default reelRouter;