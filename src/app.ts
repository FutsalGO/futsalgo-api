import express from "express";
import dotenv from "dotenv";
dotenv.config();

// Middlewares
import { cors } from "@/middlewares/cors-middleware";
import { errorHandler } from "@/middlewares/error-handler-middleware";

// Routes
import authRoutes from "@/routes/auth-route";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors);

app.use('/api/auth', authRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
