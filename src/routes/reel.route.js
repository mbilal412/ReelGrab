import express from 'express';
import { getReels } from '../contorllers/reel.controller.js';
const reelRouter = express.Router();

reelRouter.get('/', getReels);

export default reelRouter;