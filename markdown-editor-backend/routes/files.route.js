import express from "express";
import { authMiddleware } from "../middlewares/jwt.auth.js";
import { getFiles, createAndUploadFile, updateMarkdownFile, getFileText } from "../controllers/files.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getFiles);
router.get("/getfile", getFileText);
router.post("/create", authMiddleware, createAndUploadFile);
router.put("/update", authMiddleware, updateMarkdownFile);

export default router;