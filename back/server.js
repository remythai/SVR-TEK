require("dotenv").config();
const express = require("express");
const { neon } = require("@neondatabase/serverless");

const app = express();
const sql = neon(process.env.DATABASE_URL);

app.use(express.json());

app.get("/", async (req, res) => {
  const result = await sql`SELECT version()`;
  res.json(result[0]);
});

// Route startups
app.get("/startups", async (req, res) => {
    const startups = await sql`SELECT * FROM startups`;
    res.status(200).json(startups);
});

app.get("/startups/:startups_id", async (req, res) => {
    const startupId = req.params.startups_id;
  
    const startups = await sql`SELECT * FROM startups WHERE id = ${startupId}`;
    res.status(200).json(startups[0]);
});

app.get("/startups/:startup_id/founders/:founder_id/image", async (req, res) => {
    const { founder_id } = req.params;
  
    try {
      const result = await sql`
        SELECT f.image
        FROM users f
        WHERE f.founder_id = ${founder_id}
      `;
  
      if (result.length === 0) {
        return res.status(404).json({ error: "Founder not found for this startup" });
      }
  
      res.status(200).json({ image: result[0].image });
    } catch (err) {
      console.error("DB error:", err);
      res.status(500).json({ error: "Server error" });
    }
});

// Route investors
app.get("/investors", async (req, res) => {
    const investors = await sql`SELECT * FROM investors`;
    res.status(200).json(investors);
});

app.get("/investors/:investors_id", async (req, res) => {
    const investorId = req.params.investors_id;
  
    const investors = await sql`SELECT * FROM investors WHERE id = ${investorId}`;
    res.status(200).json(investors[0]);
});

app.get("/investors/:investors_id/image", async (req, res) => {
    const investorId = req.params.investors_id;
  
    const investors = await sql`SELECT * FROM investors WHERE id = ${investorId}`;
    res.status(200).json(investors[0].image);
});

// Route partners
app.get("/partners", async (req, res) => {
    const partners = await sql`SELECT * FROM partners`;
    res.status(200).json(partners);
});

app.get("/partners/:partners_id", async (req, res) => {
    const partnerId = req.params.partners_id;
  
    const partners = await sql`SELECT * FROM partners WHERE id = ${partnerId}`;
    res.status(200).json(partners[0]);
});

// Route news
app.get("/news", async (req, res) => {
    const news = await sql`SELECT * FROM news`;
    res.status(200).json(news);
});

app.get("/news/:news_id", async (req, res) => {
    const newId = req.params.news_id;
  
    const news = await sql`SELECT * FROM news WHERE id = ${newId}`;
    res.status(200).json(news[0]);
});

app.get("/news/:news_id/image", async (req, res) => {
    const newId = req.params.news_id;
  
    const news = await sql`SELECT * FROM news WHERE id = ${newId}`;
    res.status(200).json(news[0].image);
});

// Route events
app.get("/events", async (req, res) => {
    const events = await sql`SELECT * FROM events`;
    res.status(200).json(events);
});

app.get("/events/:event_id", async (req, res) => {
    const eventId = req.params.event_id;
  
    const events = await sql`SELECT * FROM events WHERE id = ${eventId}`;
    res.status(200).json(events[0]);
});

app.get("/events/:event_id/image", async (req, res) => {
    const eventId = req.params.event_id;
  
    const events = await sql`SELECT * FROM events WHERE id = ${eventId}`;
    res.status(200).json(events[0].image);
});

// Route users
app.get("/users", async (req, res) => {
    const users = await sql`SELECT * FROM users`;
    res.status(200).json(users);
});

app.get("/users/:user_id", async (req, res) => {
    const userId = req.params.user_id;
  
    const users = await sql`SELECT * FROM users WHERE id = ${userId}`;
    res.status(200).json(users[0]);
});

app.get("/users/email/:email", async (req, res) => {
    const email = req.params.email;
  
    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    res.status(200).json(users);
});

app.get("/users/:user_id/image", async (req, res) => {
    const userId = req.params.user_id;
  
    const users = await sql`SELECT * FROM users WHERE id = ${userId}`;
    res.status(200).json(users[0].image);
});
  

app.listen(3000, () => {
  console.log("🚀 Serveur démarré sur http://localhost:3000");
});
