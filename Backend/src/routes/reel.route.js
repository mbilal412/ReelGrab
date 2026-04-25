import express from "express";
import { downloadReel } from "../contorllers/reel.controller.js";
const reelRouter = express.Router();

reelRouter.post("/download", downloadReel);
reelRouter.get("/ping", (req, res) => {
  console.log("ping at ", new Date());
  res.status(200).json({ message: "pong" });
});

export default reelRouter;
