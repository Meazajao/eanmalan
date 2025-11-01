import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

export async function getTickets(req, res) {
  try {
    const rows = await prisma.ticket.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kunde inte hämta tickets" });
  }
}

export async function createTicket(req, res) {
  try {
    let { title, desc, priority = 2 } = req.body || {};

    if (typeof title !== "string" || typeof desc !== "string") {
      return res.status(400).json({ error: "title och desc måste vara text" });
    }

    title = title.trim();
    desc = desc.trim();

    if (!title || !desc) {
      return res.status(400).json({ error: "titel och desc krävs" });
    }

    let p = Number(priority);
    if (!Number.isFinite(p)) p = 2;
    if (p < 1) p = 1;
    if (p > 3) p = 3;

    const data = {
      id: nanoid(),
      title,
      desc,
      priority: p,
      status: "OPEN",
    };

    const ticket = await prisma.ticket.create({ data });
    return res.status(201).json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
