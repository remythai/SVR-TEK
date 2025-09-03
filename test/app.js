import dotenv from "dotenv";
import express from "express";
import { neon } from "@neondatabase/serverless";
import startupsRoutes from "./routes/startups.routes.js";
import investorsRoutes from "./routes/investors.routes.js";
import partnersRoutes from "./routes/partners.routes.js";
import newsRoutes from "./routes/news.routes.js";
import eventsRoutes from "./routes/events.routes.js"

dotenv.config();

const app = express();
app.use(express.json());

const sql = neon(process.env.DATABASE_URL);
app.set("db", sql);

app.get("/", async (req, res) => {
  const result = await sql`SELECT version()`;
  res.json(result[0]);
});

app.use("/startups", startupsRoutes);
app.use("/investors", investorsRoutes);
app.use("/partners", partnersRoutes);
app.use("/news", newsRoutes);
app.use("/events", eventsRoutes)

export default app;