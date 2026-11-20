import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";

dotenv.config();

const app = express();
// Trust Render's reverse proxy (required for express-rate-limit & secure cookies)
app.set("trust proxy", 1);
connectDB();

// 1. Security HTTP Headers
app.use(helmet());

// 2. Strict CORS (Only allows your React frontend + cookies)
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);


// 3. Rate Limiting (Protects against spam & DoS)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/api", apiLimiter);

// 4. Body & Cookie Parsers (with strict 10kb JSON limit)
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// 5. Health Check Route
app.get("/api/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Lumora API is secure and running" });
});

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/subscribers", subscriberRoutes);

// 6. Error Handlers (Always last)
app.use(notFound);
app.use(errorHandler);

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

export default app;
