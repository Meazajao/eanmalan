import express from "express";
import prisma from "../prismaClient.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "superhemligt";
const JWT_EXPIRES = "7d";

// POST /auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Användarnamn och lösenord krävs" });
    }

    const existing = await prisma.user.findUnique({
      where: { username },
    });

    if (existing) {
      return res
        .status(400)
        .json({ error: "Användarnamn redan taget" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashed,
        role: "USER",
      },
    });

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Fel vid register:", err);
    res.status(500).json({ error: "Kunde inte skapa konto" });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Användarnamn och lösenord krävs" });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res
        .status(401)
        .json({ error: "Fel användarnamn eller lösenord" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res
        .status(401)
        .json({ error: "Fel användarnamn eller lösenord" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Fel vid login:", err);
    res.status(500).json({ error: "Kunde inte logga in" });
  }
});

// POST /auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.json({ ok: true });
});

// GET /auth/me
router.get("/me", authenticate, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      username: true,
      role: true,
    },
  });

  if (!user) {
    return res.status(404).json({ error: "Användare ej hittad" });
  }

  res.json({ user });
});

export default router;
