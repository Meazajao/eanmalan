import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import ticketRoutes from "./routes/tickets.js";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/messages.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// CORS
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const allowedOrigins = [
  FRONTEND_URL,
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // tillåt requests utan origin (t.ex. curl/postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);


// Logger
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("tiny"));
}

// Rate limiting
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
  })
);

// Routes
app.use("/auth", authRoutes);
app.use("/tickets", ticketRoutes);
app.use("/messages", messageRoutes);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Route hittades inte" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Serverfel:", err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({ error: "Serverfel" });
});

app.listen(PORT, () => {
  console.log(
    `🚀 Server körs på http://localhost:${PORT} (NODE_ENV=${process.env.NODE_ENV})`
  );
});
