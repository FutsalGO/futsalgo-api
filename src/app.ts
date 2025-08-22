import express from "express";
import authRoute from "./routes/auth-route";

const app = express();
app.use(express.json());

app.use("/api/auth", authRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
