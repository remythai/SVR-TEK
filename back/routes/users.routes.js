import express from "express";
import {
  getAll,
  getById,
  getByEmail,
  getUserImage,
  create,
  register,
  login,
  updatePassword,
  update,
  deleteById
} from "../controllers/users.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// ----------
// -- Read --
// ----------

router.get("/auth/me", authenticate, async (req, res) => {
  const sql = req.app.get("db");
  try {
    const user = await getByIdController(sql, req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { password, ...userData } = user;
    res.status(200).json(userData);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", getAll);
router.get("/email/:email", getByEmail);

router.get("/:id/image", getUserImage);
router.get("/:id", getById);
router.put("/:id", update);

// ------------
// -- Create --
// ------------
router.post("/", create);
router.post("/register", register);
router.post("/login", login);

// ------------
// -- Update --
// ------------
router.put("/update-password", authenticate, updatePassword);

// ------------
// -- Delete --
// ------------
router.delete("/:id", deleteById);

export default router;

async function getByIdController(sql, id) {
  const user = await import("../models/users.model.js").then(m => m.default.getById(sql, id));
  return user[0] ?? null;
}
