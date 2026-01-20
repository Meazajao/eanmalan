import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function validateInput(username, password) {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;

  if (!username || !usernameRegex.test(username)) return false;
  if (!password || password.length < 8) return false;

  return true;
}

export async function register(req, res) {
  try {
    const { username, password } = req.body;

    if (!validateInput(username, password)) {
      return res
        .status(400)
        .json({ error: "Felaktigt användarnamn eller lösenord" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Användarnamnet är redan taget" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: "USER",
      },
    });

    res.status(201).json({
      message: "Konto skapat",
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Fel vid registrering:", err);
    res.status(500).json({ error: "Serverfel vid registrering" });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!validateInput(username, password)) {
      return res
        .status(400)
        .json({ error: "Felaktigt användarnamn eller lösenord" });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res
        .status(401)
        .json({ error: "Fel användarnamn eller lösenord" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
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
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 2 * 60 * 60 * 1000,
      })
      .json({
        message: "Inloggning lyckades",
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
  } catch (err) {
    console.error("Fel vid login:", err);
    res.status(500).json({ error: "Serverfel vid login" });
  }
}

export async function me(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: "Ej autentiserad" });
  }

  const { id, username, role } = req.user;
  res.json({ id, username, role });
}

export async function logout(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
    });

    res.json({ message: "Utloggad" });
  } catch (err) {
    console.error("Fel vid logout:", err);
    res.status(500).json({ error: "Serverfel vid logout" });
  }
}
