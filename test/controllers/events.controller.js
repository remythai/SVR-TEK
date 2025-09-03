import Events from "../models/events.model.js";

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
  const { id } = req.params.events_id;
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
  const { events_id } = req.params.events_id;

  try {
    const image = await Events.getEventImage(sql, events_id);
    if (!image[0]) return res.status(404).json({ error: "Event not found" });
    res.status(200).json({ image: image[0].image });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Servor error" });
  }
};