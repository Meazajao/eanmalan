import prisma from "../prismaClient.js";
import jwt from "jsonwebtoken";

export async function authenticate(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: "Ej autentiserad" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({ error: "Ogiltig token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({ error: "Ej autentiserad" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware fel:", err.message);
    res.status(401).json({ error: "Ogiltig token" });
  }
}
