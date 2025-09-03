import Startup from "../models/startups.model.js";

// ----------
// -- Read --
// ----------

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

// ------------
// -- Create --
// ------------

export const create = async (req, res) => {
  const sql = req.app.get("db");
  try {
    const [newStartup] = await Startup.create(sql, req.body);
    res.status(201).json(newStartup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};


// ------------
// -- Delete --
// ------------

export const deleteById = async (req, res) => {
  const sql = req.app.get("db");
  const { id } = req.params;
  
  try {
    const result = await Startup.deleteById(sql, id);
    
    if (result.count === 0) {
      return res.status(404).json({ error: "Startup not found" });
    }
    
    res.status(200).json({ message: "Startup deleted successfully" });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
