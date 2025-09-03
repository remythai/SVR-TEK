import Events from "../models/events.model.js";

// ----------
// -- Read --
// ----------

export const getAll = async (req, res) => {
  const sql = req.app.get("db");
  try {
    const events = await Events.getAll(sql);
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getById = async (req, res) => {
  const sql = req.app.get("db");
  const { id } = req.params;
  try {
    const events = await Events.getById(sql, id);
    if (!events[0]) return res.status(404).json({ error: "Event not found" });
    res.status(200).json(events[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getEventImage = async (req, res) => {
  const sql = req.app.get("db");
  const { id } = req.params;

  try {
    const image = await Events.getEventImage(sql, id);
    if (!image[0]) return res.status(404).json({ error: "Event not found" });
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
    const [newEvents] = await Events.create(sql, req.body);
    res.status(201).json(newEvents);
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
    const result = await Events.deleteById(sql, id);
    
    if (result.count === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update

export const update = async (req, res) => {
  const sql = req.app.get("db");
  const { id } = req.params;
  const data = req.body;
  
  try {
    const result = await Events.update(sql, data, id);
    
    if (result.count === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    res.status(200).json({ message: "Event updated successfully" });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
