import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import prisma from "../prismaClient.js";

const router = express.Router();

// GET /messages/:ticketId?limit=50&offset=0
router.get("/:ticketId", authenticate, async (req, res) => {
  try {
    const { ticketId } = req.params;

    const limit = Math.min(
      parseInt(req.query.limit || "50", 10),
      200
    );
    const offset = Math.max(
      parseInt(req.query.offset || "0", 10),
      0
    );

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return res.status(404).json({ error: "Ärendet hittades inte" });
    }

    if (req.user.role !== "ADMIN" && req.user.id !== ticket.userId) {
      return res
        .status(403)
        .json({ error: "Du har inte behörighet att se meddelanden" });
    }

    const messages = await prisma.message.findMany({
      where: { ticketId },
      orderBy: { createdAt: "asc" },
      skip: offset,
      take: limit,
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
    });

    res.json(messages);
  } catch (err) {
    console.error("Fel vid hämtning av meddelanden:", err);
    res.status(500).json({ error: "Kunde inte hämta meddelanden" });
  }
});

// POST /messages/:ticketId
router.post("/:ticketId", authenticate, async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res
        .status(400)
        .json({ error: "Meddelande kan inte vara tomt" });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return res.status(404).json({ error: "Ärendet hittades inte" });
    }

    if (req.user.role !== "ADMIN" && req.user.id !== ticket.userId) {
      return res
        .status(403)
        .json({ error: "Du har inte behörighet att skicka meddelanden" });
    }

    const message = await prisma.message.create({
      data: {
        text: text.trim(),
        senderId: req.user.id,
        ticketId,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
    });

    res.status(201).json(message);
  } catch (err) {
    console.error("Fel vid skickande av meddelande:", err);
    res.status(500).json({ error: "Kunde inte skicka meddelande" });
  }
});

export default router;
