import express from "express";
import { getTickets, createTicket, closeTicket } from "../controllers/ticketsController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getTickets);
router.post("/", authenticate, createTicket);
router.patch("/:id/close", authenticate, closeTicket);

export default router;
