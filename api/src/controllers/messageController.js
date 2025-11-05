import prisma from "../prismaClient.js";

// Hämta alla meddelanden för ett ärende
export async function getMessages(req, res) {
  try {
    const { ticketId } = req.params;

    const messages = await prisma.message.findMany({
      where: { ticketId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: { select: { username: true, role: true } },
      },
    });

    res.json(messages);
  } catch (err) {
    console.error("Fel vid hämtning av meddelanden:", err);
    res.status(500).json({ error: "Kunde inte hämta meddelanden" });
  }
}

// Skicka ett nytt meddelande
export async function sendMessage(req, res) {
  try {
    const { ticketId } = req.params;
    const { text } = req.body;
    const user = req.user;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Meddelande kan inte vara tomt" });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return res.status(404).json({ error: "Ärendet hittades inte" });
    }

    if (user.role !== "ADMIN" && user.id !== ticket.userId) {
      return res.status(403).json({
        error: "Du har inte behörighet att skicka meddelande i detta ärende",
      });
    }

    const message = await prisma.message.create({
      data: {
        text: text.trim(),
        senderId: user.id,
        ticketId,
      },
      include: { sender: { select: { username: true, role: true } } },
    });

    res.status(201).json(message);
  } catch (err) {
    console.error("Fel vid skickande av meddelande:", err);
    res.status(500).json({ error: "Kunde inte skicka meddelande" });
  }
}
