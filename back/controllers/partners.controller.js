import Partner from "../models/partners.model.js";

export const getAll = async (req, res) => {
  const sql = req.app.get("db");
  try {
    const partners = await Partner.getAll(sql);
    res.status(200).json(partners);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
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
