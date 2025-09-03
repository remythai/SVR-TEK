import Users from "../models/users.model.js";

export const getAll = async (req, res) => {
  const sql = req.app.get("db");
  try {
    const users = await Users.getAll(sql);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getById = async (req, res) => {
  const sql = req.app.get("db");
  const { id } = req.params.user_id;
  try {
    const users = await Users.getById(sql, id);
    if (!users[0]) return res.status(404).json({ error: "User not found" });
    res.status(200).json(users[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getByEmail = async (req, res) => {
    const sql = req.app.get("db");
    const { email } = req.params.email;
  
    try {
      const users = await Users.getByEmail(sql, email);
  
      if (!users[0]) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json(users[0]);
    } catch (err) {
      console.error("DB error:", err);
      res.status(500).json({ error: "Server error" });
    }
};

export const getUserImage = async (req, res) => {
  const sql = req.app.get("db");
  const { users_id } = req.params.user_id;

  try {
    const image = await Users.getUserImage(sql, users_id);
    if (!image[0]) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ image: image[0].image });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Servor error" });
  }
};
