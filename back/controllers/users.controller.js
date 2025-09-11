import Users from "../models/users.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ---------- READ ----------
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
    if (!users[0]) return res.status(404).json({ error: "User not found" });
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
    res.status(500).json({ error: "Server error" });
  }
};

// ---------- CREATE ----------
export const create = async (req, res) => {
  const sql = req.app.get("db");
  try {
    const [newUser] = await Users.create(sql, req.body);
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const register = async (req, res) => {
  const sql = req.app.get("db");
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    const existingUser = await Users.getByEmail(sql, email);
    if (existingUser.length > 0)
      return res.status(409).json({ error: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Users.register(sql, { name, email, password: hashedPassword });

    const access_token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "1h" }
    );

    const refresh_token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      access_token,
      refresh_token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  const sql = req.app.get("db");
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    const existingUser = await Users.getByEmail(sql, email);
    if (!existingUser[0])
      return res.status(404).json({ error: "No account with this email" });

    const user = existingUser[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Wrong password" });

    const access_token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "1h" }
    );

    const refresh_token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      access_token,
      refresh_token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------- UPDATE ----------
export const updatePassword = async (req, res) => {
  const sql = req.app.get("db");
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  const userId = req.user.id;

  if (!oldPassword || !newPassword || !confirmNewPassword)
    return res.status(400).json({ error: "Missing required fields" });

  if (newPassword !== confirmNewPassword)
    return res.status(400).json({ error: "Passwords do not match" });

  try {
    const existingUser = await Users.getById(sql, userId);
    if (!existingUser[0]) return res.status(404).json({ error: "User not found" });

    const user = existingUser[0];
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Old password incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Users.updatePassword(sql, userId, hashedPassword);

    res.status(200).json({
      success: true,
      message: "Password updated successfully. Please login again.",
    });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const update = async (req, res) => {
  const sql = req.app.get("db");
  const { id } = req.params;
  const data = req.body;

  try {
    const result = await Users.update(sql, data, id);
    if (result.count === 0) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------- DELETE ----------
export const deleteById = async (req, res) => {
  const sql = req.app.get("db");
  const { id } = req.params;

  try {
    const result = await Users.deleteById(sql, id);
    if (result.count === 0) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
