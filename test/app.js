import dotenv from "dotenv";
import express from "express";
import { neon } from "@neondatabase/serverless";
import startupsRoutes from "./routes/startups.routes.js";

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

export default app;