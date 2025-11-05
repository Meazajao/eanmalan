import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ticketRoutes from "./routes/tickets.js";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/messages.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log("➡️ Request:", req.method, req.url);
  next();
});


app.get("/health", (req, res) => res.json({ ok: true }));


app.use("/tickets", ticketRoutes);
app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);

app.listen(PORT, () => console.log(`🚀 Server körs på http://localhost:${PORT}`));
