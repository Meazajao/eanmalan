import prisma from "../prismaClient.js";
import { nanoid } from "nanoid";



  // GET /tickets

export async function getTickets(req, res) {
  try {
    const user = req.user; 
    let tickets;

    if (user.role === "ADMIN") {
      //  Admin ser alla tickets
      tickets = await prisma.ticket.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: { select: { username: true } } }, // visar vem som skapade ärendet
      });
    } else {
      //  Vanlig användare ser bara sina egna
      tickets = await prisma.ticket.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });
    }

    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kunde inte hämta tickets" });
  }
}

// POST /tickets

export async function createTicket(req, res) {
  try {
    const { title, desc, priority = 2 } = req.body || {};
    const user = req.user; 

    // validering
    if (typeof title !== "string" || typeof desc !== "string") {
      return res.status(400).json({ error: "title och desc måste vara text" });
    }

    const cleanTitle = title.trim();
    const cleanDesc = desc.trim();

    if (!cleanTitle || !cleanDesc) {
      return res.status(400).json({ error: "titel och desc krävs" });
    }

    //  Prioritetsnivå 
    let p = Number(priority);
    if (!Number.isFinite(p)) p = 2;
    if (p < 1) p = 1;
    if (p > 3) p = 3;

    // Skapa ticket och koppla till användaren
    const data = {
      id: nanoid(),
      title: cleanTitle,
      desc: cleanDesc,
      priority: p,
      status: "OPEN",
      userId: user.id, 
    };

    const ticket = await prisma.ticket.create({ data });
    res.status(201).json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error vid skapande av ticket" });
  }
}

//PATCH /tickets/:id/close
 
export async function closeTicket(req, res) {
    try {
  
      const { id } = req.params;
      const user = req.user;
  
      const ticket = await prisma.ticket.findUnique({ where: { id } });
      if (!ticket) {
        return res.status(404).json({ error: "Ärendet hittades inte" });
      }
  
      if (ticket.userId !== user.id && user.role !== "ADMIN") {
        return res
          .status(403)
          .json({ error: "Inte behörig att stänga detta ärende" });
      }
  
      const updated = await prisma.ticket.update({
        where: { id },
        data: { status: "CLOSED" },
      });
  
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Kunde inte stänga ärendet" });
    }
  }
  