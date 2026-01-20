import express from "express";
import { getTickets, createTicket, closeTicket, getTicketById } from "../controllers/ticketsController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Alla tickets-routes kräver autentisering
router.use(authenticate);

router.get("/", getTickets);
router.get("/:id", getTicketById);
router.post("/", createTicket);
router.patch("/:id/close", closeTicket);

export default router;
