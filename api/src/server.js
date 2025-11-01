import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ticketRoutes from "./routes/tickets.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));


app.use("/tickets", ticketRoutes);

app.listen(PORT, () => console.log(`🚀 Server körs på http://localhost:${PORT}`));
