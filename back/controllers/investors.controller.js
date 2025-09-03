import Investor from "../models/investors.model.js";

// ----------
// -- Read --
// ----------

export const getAll = async (req, res) => {
  const sql = req.app.get("db");
  try {
    const investors = await Investor.getAll(sql);
    res.status(200).json(investors);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getById = async (req, res) => {
  const sql = req.app.get("db");
  const { id } = req.params;
  try {
    const investor = await Investor.getById(sql, id);
    if (!investor[0]) return res.status(404).json({ error: "Investor not found" });
    res.status(200).json(investor[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getInvestorImage = async (req, res) => {
  const sql = req.app.get("db");
  const { id } = req.params;

  try {
    const image = await Investor.getInvestorImage(sql, id);
    if (!image[0]) return res.status(404).json({ error: "Investor not found" });
    res.status(200).json({ image: image[0].image });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Servor error" });
  }
};

// ------------
// -- Create --
// ------------

export const create = async (req, res) => {
  const sql = req.app.get("db");
  try {
    const [newInvestor] = await Investor.create(sql, req.body);
    res.status(201).json(newInvestor);
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
    const result = await Investor.deleteById(sql, id);
    
    if (result.count === 0) {
      return res.status(404).json({ error: "Investor not found" });
    }
    
    res.status(200).json({ message: "Investor deleted successfully" });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update

export const update = async (req, res) => {
  const sql = req.app.get("db");
  const { id } = req.params;
  
  try {
    const result = await Users.update(sql, id);
    
    if (result.count === 0) {
      return res.status(404).json({ error: "Investor not found" });
    }
    
    res.status(200).json({ message: "Investor updated successfully" });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Server error" });
  }
}