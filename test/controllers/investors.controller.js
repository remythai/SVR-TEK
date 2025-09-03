import Investor from "../models/investors.model.js";

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
    const image = await Startup.getInvestorImage(sql, id);
    if (!image[0]) return res.status(404).json({ error: "Investor not found" });
    res.status(200).json({ image: image[0].image });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Servor error" });
  }
};