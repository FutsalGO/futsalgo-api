import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { cors } from "@/middlewares/cors-middleware";
import { errorHandler } from "@/middlewares/error-handler-middleware";
import authRoutes from "@/routes/auth-route";
import userBookingRoutes from "@/routes/user/booking-route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors);

app.use("/api/auth", authRoutes);
app.use("/api/bookings/user", userBookingRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
