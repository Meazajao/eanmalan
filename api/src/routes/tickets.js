import express from "express";
import { getTickets, createTicket } from "../controllers/ticketsController.js";

const router = express.Router();

// Hämta alla tickets
router.get("/", getTickets);

// Skapa nytt ticket
router.post("/", createTicket);

export default router;
