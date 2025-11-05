import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { getMessages, sendMessage } from "../controllers/messageController.js";

const router = express.Router();


router.get("/:ticketId", authenticate, getMessages);

router.post("/:ticketId", authenticate, sendMessage);

export default router;
