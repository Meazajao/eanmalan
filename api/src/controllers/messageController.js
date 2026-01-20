import prisma from "../prismaClient.js";

// GET /messages/:ticketId?limit=50&offset=0
export async function getMessages(req, res) {
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

    if (!ticketId) {
      return res.status(400).json({ error: "Ticket ID saknas" });
    }

    const messages = await prisma.message.findMany({
      where: { ticketId },
      orderBy: { createdAt: "asc" },
      skip: offset,
      take: limit,
      include: {
        sender: {
          select: {
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
}

export async function sendMessage(req, res) {
  try {
    const { ticketId } = req.params;
    const { text } = req.body;
    const user = req.user;

    if (!ticketId) {
      return res.status(400).json({ error: "Ticket ID saknas" });
    }

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

    if (user.role !== "ADMIN" && user.id !== ticket.userId) {
      return res.status(403).json({ error: "Du har inte behörighet" });
    }

    const message = await prisma.message.create({
      data: {
        text: text.trim(),
        senderId: user.id,
        ticketId,
      },
      include: {
        sender: {
          select: {
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
}
