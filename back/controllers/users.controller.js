import Users from "../models/users.model.js";
import bcrypt from "bcryptjs";

// ----------
// -- Read --
// ----------

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
  const { id } = req.params;
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
    const { email } = req.params;
  
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
  const { id } = req.params;

  try {
    const image = await Users.getUserImage(sql, id);
    if (!image[0]) return res.status(404).json({ error: "User not found" });
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
    const [newUser] = await Users.create(sql, req.body);
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export const register = async (req, res) => {
  const sql = req.app.get("db");
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  try {
    const existingUser = await Users.getByEmail(sql, email);
    if (existingUser.length > 0) {
      return res.status(409).json({ error: "Email already in use" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Users.register(sql, { name, email, password: hashedPassword });

    res.status(201).json({
      success: true,
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  const sql = req.app.get("db");
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const existingUser = await Users.getByEmail(sql, email);
    if (existingUser.length <= 0) {
      return res.status(409).json({ error: "No account with this email" });
    }

    if (bcrypt.compare(password, existingUser.hashedPassword)) {
      res.status(201).json({
        success: true,
        user: { id: existingUser.id, name: existingUser.name, email: existingUser.email }
      });
    }
    res.status(500).json({ error: "Wrong Password" });
// ------------
// -- Delete --
// ------------

export const deleteById = async (req, res) => {
  const sql = req.app.get("db");
  const { id } = req.params;
  
  try {
    const result = await Users.deleteById(sql, id);
    
    if (result.count === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Server error" });
  }
};