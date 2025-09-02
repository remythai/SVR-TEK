import Startup from "../models/startups.model.js";

export const getAll = async (req, res) => {
  const sql = req.app.get("db");
  try {
    const startups = await Startup.getAll(sql);
    res.status(200).json(startups);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getById = async (req, res) => {
  const sql = req.app.get("db");
  const { id } = req.params;
  try {
    const startup = await Startup.getById(sql, id);
    if (!startup[0]) return res.status(404).json({ error: "Startup non trouvée" });
    res.status(200).json(startup[0]);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getFounderImage = async (req, res) => {
  const sql = req.app.get("db");
  const { founder_id } = req.params;
  try {
    const image = await Startup.getFounderImage(sql, founder_id);
    if (!image[0]) return res.status(404).json({ error: "Founder not found for this startup" });
    res.status(200).json({ image: image[0].image });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};