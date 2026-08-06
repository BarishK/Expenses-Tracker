import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import transactionsRoutes from "./routes/transactionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

const allowedOrigins = [
  "http://localhost:3001",
  process.env.CLIENT_URL, // Vercel canlı URL'i buraya gelecek
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Postman veya origin göndermeyen istekler için izin ver
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS politikasınca engellendi: " + origin));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// Rotaları bağla
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server çalışıyor`);
});
