import prisma from "../prismaClient.js";
import { nanoid } from "nanoid";

function sanitizeText(value) {
  if (typeof value !== "string") return "";
  return value.replace(/[<>]/g, "");
}

function normalizePriority(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 2;

  const p = Math.round(n);
  if (p < 1) return 1;
  if (p > 3) return 3;
  return p;
}

function parsePaging(req) {
  const limit = Math.min(
    Math.max(parseInt(req.query.limit || "50", 10), 1),
    200
  );
  const offset = Math.max(parseInt(req.query.offset || "0", 10), 0);

  return { limit, offset };
}

// GET /tickets (Admin: alla, User: egna) + status/search + pagination
export async function getTickets(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Ej autentiserad" });
    }

    const { limit, offset } = parsePaging(req);

    const status =
      typeof req.query.status === "string"
        ? req.query.status.trim().toUpperCase()
        : "";

    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const baseWhere = user.role === "ADMIN" ? {} : { userId: user.id };

    const statusWhere =
      status === "OPEN" || status === "CLOSED" ? { status } : {};

    const searchWhere = search
      ? {
          OR: [
            { title: { contains: search } },
            { desc: { contains: search } },
            { id: { contains: search } },
            ...(user.role === "ADMIN"
              ? [{ user: { username: { contains: search } } }]
              : []),
          ],
        }
      : {};

    const tickets = await prisma.ticket.findMany({
      where: { ...baseWhere, ...statusWhere, ...searchWhere },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
      include: {
        user:
          user.role === "ADMIN"
            ? { select: { id: true, username: true } }
            : false,
      },
    });

    res.json({
      items: tickets,
      limit,
      offset,
      status: status || "ALL",
      search: search || "",
    });
  } catch (err) {
    console.error("Fel vid hämtning tickets:", err);
    res.status(500).json({ error: "Kunde inte hämta tickets" });
  }
}

// GET /tickets/:id (Admin: alla, User: egna)
export async function getTicketById(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Ej autentiserad" });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Ticket id saknas" });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        user:
          user.role === "ADMIN"
            ? { select: { id: true, username: true } }
            : false,
      },
    });

    if (!ticket) {
      return res.status(404).json({ error: "Ärendet hittades inte" });
    }

    const canView = user.role === "ADMIN" || ticket.userId === user.id;
    if (!canView) {
      return res
        .status(403)
        .json({ error: "Inte behörig att se detta ärende" });
    }

    res.json(ticket);
  } catch (err) {
    console.error("Fel vid hämtning ticket:", err);
    res.status(500).json({ error: "Kunde inte hämta ticket" });
  }
}

// POST /tickets (skapar nytt ärende för inloggad användare)
export async function createTicket(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Ej autentiserad" });
    }

    const { title, desc = "", priority = 2 } = req.body || {};

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "Titel krävs" });
    }

    const cleanTitle = sanitizeText(title).trim().slice(0, 200);
    const cleanDesc = sanitizeText(desc).trim().slice(0, 2000);

    if (!cleanTitle) {
      return res.status(400).json({ error: "Ogiltig titel" });
    }

    const ticket = await prisma.ticket.create({
      data: {
        id: nanoid(),
        title: cleanTitle,
        desc: cleanDesc,
        priority: normalizePriority(priority),
        status: "OPEN",
        userId: user.id,
      },
    });

    res.status(201).json(ticket);
  } catch (err) {
    console.error("Fel vid skapa ticket:", err);
    res.status(500).json({ error: "Kunde inte skapa ärende" });
  }
}

// PATCH /tickets/:id/close (ägare eller admin)
export async function closeTicket(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Ej autentiserad" });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Ticket id saknas" });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      return res.status(404).json({ error: "Ärendet hittades inte" });
    }

    const canClose = ticket.userId === user.id || user.role === "ADMIN";
    if (!canClose) {
      return res
        .status(403)
        .json({ error: "Inte behörig att stänga detta ärende" });
    }

    if (ticket.status === "CLOSED") {
      return res.status(400).json({ error: "Ärendet är redan stängt" });
    }

    const updated = await prisma.ticket.update({
      where: { id },
      data: { status: "CLOSED" },
    });

    res.json(updated);
  } catch (err) {
    console.error("Fel vid stänga ticket:", err);
    res.status(500).json({ error: "Kunde inte stänga ärendet" });
  }
}
