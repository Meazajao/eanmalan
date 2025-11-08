import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// registrera ny användare
export async function register(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Användarnamn och lösenord krävs" });
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "Användarnamnet är redan taget" });
    }

    // Hasha lösenordet ordentligt
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Skapa användare i databasen
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: "USER", 
      },
    });

    res.status(201).json({
      message: "Konto skapat ",
      user: { username: user.username },
    });
  } catch (err) {
    console.error("Fel vid registrering:", err);
    res.status(500).json({ error: "Serverfel vid registrering" });
  }
}

//  Logga in användare
export async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Användarnamn och lösenord krävs" });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Fel användarnamn eller lösenord" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Fel användarnamn eller lösenord" });
    }

   
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" } 
    );

    const decoded = jwt.decode(token);

    res.json({
      message: "Inloggning lyckades ",
      token,
      expiresAt: decoded.exp * 1000, 
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
