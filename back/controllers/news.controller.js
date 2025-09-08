import News from "../models/news.model.js";

// ----------
// -- Read --
// ----------

export const getAll = async (req, res) => {
  const sql = req.app.get("db");
  try {
    const news = await News.getAll(sql);
    res.status(200).json(news);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getById = async (req, res) => {
  const sql = req.app.get("db");
  const { id } = req.params;
  try {
    const news = await News.getById(sql, id);
    if (!news[0]) return res.status(404).json({ error: "News not found" });
    res.status(200).json(news[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getNewsImage = async (req, res) => {
  const sql = req.app.get("db");
  const { id } = req.params;

  try {
    const image = await News.getNewsImage(sql, id);
    if (!image[0]) return res.status(404).json({ error: "News not found" });
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
    const [newNews] = await News.create(sql, req.body);
    res.status(201).json(newNews);
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
    const result = await News.deleteById(sql, id);
    
    if (result.count === 0) {
      return res.status(404).json({ error: "News not found" });
    }
    
    res.status(200).json({ message: "News deleted successfully" });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ------------
// -- Update --
// ------------

export const update = async (req, res) => {
  const sql = req.app.get("db");
  const { id } = req.params;
  
  try {
    const result = await News.update(sql, id);
    
    if (result.count === 0) {
      return res.status(404).json({ error: "News not found" });
    }
    
    res.status(200).json({ message: "News updated successfully" });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
