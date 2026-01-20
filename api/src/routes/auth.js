import express from "express";
import prisma from "../prismaClient.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = "7d";

function getCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProd, // måste vara true på Render (https)
    sameSite: isProd ? "none" : "lax", // none krävs när frontend+backend är olika origins
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

function getClearCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  };
}

// POST /auth/register
router.post("/register", async (req, res) => {
  try {
    if (!JWT_SECRET) {
      return res.status(500).json({ error: "JWT_SECRET saknas i miljön" });
    }

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Användarnamn och lösenord krävs" });
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return res.status(400).json({ error: "Användarnamn redan taget" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashed,
        role: "USER",
      },
      select: {
        id: true,
        username: true,
        role: true,
      },
    });

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    res.cookie("token", token, getCookieOptions());

    return res.status(201).json({ user });
  } catch (err) {
    console.error("Fel vid register:", err);
    return res.status(500).json({ error: "Kunde inte skapa konto" });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    if (!JWT_SECRET) {
      return res.status(500).json({ error: "JWT_SECRET saknas i miljön" });
    }

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Användarnamn och lösenord krävs" });
    }

    const userRow = await prisma.user.findUnique({ where: { username } });
    if (!userRow) {
      return res.status(401).json({ error: "Fel användarnamn eller lösenord" });
    }

    const match = await bcrypt.compare(password, userRow.password);
    if (!match) {
      return res.status(401).json({ error: "Fel användarnamn eller lösenord" });
    }

    const user = {
      id: userRow.id,
      username: userRow.username,
      role: userRow.role,
    };

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    res.cookie("token", token, getCookieOptions());

    return res.json({ user });
  } catch (err) {
    console.error("Fel vid login:", err);
    return res.status(500).json({ error: "Kunde inte logga in" });
  }
});

// POST /auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie("token", getClearCookieOptions());
  return res.json({ ok: true });
});

// GET /auth/me
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, username: true, role: true },
    });

    if (!user) return res.status(404).json({ error: "Användare ej hittad" });

    return res.json({ user });
  } catch (err) {
    console.error("Fel vid /auth/me:", err);
    return res.status(500).json({ error: "Serverfel" });
  }
});

export default router;
