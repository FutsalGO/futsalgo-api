import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import corsMiddleware from "@/middlewares/cors-middleware";
import { errorHandler } from "@/middlewares/error-handler-middleware";
import authRoutes from "@/routes/auth-route";
import fieldRoute from "@/routes/fields-route";
import scheduleRoutes from "@/routes/schedule-route";
import userBookingRoutes from "@/routes/user/booking-route";
import adminBookingRoutes from "@/routes/admin/booking-route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(corsMiddleware);

app.use(
  "/uploadField",
  express.static(path.join(__dirname, "..", "src/uploadField"))
);

app.use("/auth", authRoutes);
app.use("/fields", fieldRoute);
app.use("/schedules", scheduleRoutes);
app.use("/bookings/user", userBookingRoutes);
app.use("/bookings/admin", adminBookingRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
