import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { neon } from "@neondatabase/serverless";
import startupsRoutes from "./routes/startups.routes.js";
import investorsRoutes from "./routes/investors.routes.js";
import partnersRoutes from "./routes/partners.routes.js";
import newsRoutes from "./routes/news.routes.js";
import eventsRoutes from "./routes/events.routes.js";
import usersRoutes from "./routes/users.routes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Group-Authorization',
    'Accept',
    'Origin',
    'X-Requested-With'
  ]
}));

app.use(express.json());

const sql = neon(process.env.DATABASE_URL);
app.set("db", sql);

app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "API is running",
    timestamp: new Date().toISOString() 
  });
});

app.get("/", async (req, res) => {
  const result = await sql`SELECT version()`;
  res.json(result[0]);
});

app.use("/startups", startupsRoutes);
app.use("/investors", investorsRoutes);
app.use("/partners", partnersRoutes);
app.use("/news", newsRoutes);
app.use("/events", eventsRoutes);
app.use("/users", usersRoutes);

export default app;