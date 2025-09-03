import Partner from "../models/partners.model.js";

// ----------
// -- Read --
// ----------

export const getAll = async (req, res) => {
  const sql = req.app.get("db");
  try {
    const partners = await Partner.getAll(sql);
    res.status(200).json(partners);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getById = async (req, res) => {
  const sql = req.app.get("db");
  const { id } = req.params;
  try {
    const partner = await Partner.getById(sql, id);
    if (!partner[0]) return res.status(404).json({ error: "Partner not found" });
    res.status(200).json(partner[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ------------
// -- Create --
// ------------

export const create = async (req, res) => {
  const sql = req.app.get("db");
  try {
    const [newPartner] = await Partner.create(sql, req.body);
    res.status(201).json(newPartner);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

// ------------
// -- Delete --
// ------------

export const deleteById = async (req, res) => {
  const sql = req.app.get("db");
  const { id } = req.params;
  
  try {
    const result = await Partner.deleteById(sql, id);
    
    if (result.count === 0) {
      return res.status(404).json({ error: "Partner not found" });
    }
    
    res.status(200).json({ message: "Partner deleted successfully" });
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
      return res.status(404).json({ error: "Partner not found" });
    }
    
    res.status(200).json({ message: "Partner updated successfully" });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Server error" });
  }
}