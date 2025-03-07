import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import routes from "./routes/index.js";

dotenv.config();
const PORT = process.env.PORT || 8000;

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

connectDB();

// Use the defined routes
app.use("/api", routes);

app.listen(PORT, () => {
  const baseUrl = `http://localhost:${PORT}`;
  console.log(`Server running on port ${PORT}`);
  console.log(`Web server listening at: ${baseUrl}`);
});
