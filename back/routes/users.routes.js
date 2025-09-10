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
router.get("/", getAll);
router.get("/email/:email", getByEmail);

// ------------
// -- Create --
// ------------
router.post("/", create);

router.post("/register", register);
router.post("/login", login);

router.get("/dashboard", authenticate, (req, res) => {
  res.json({ message: "Dashboard accessible", user: req.user });
});

router.put("/update-password", authenticate, updatePassword);

router.get("/:id", getById);
router.get("/:id/image", getUserImage);
router.put("/:id", update);

// ------------
// -- Delete --
// ------------
router.delete("/:id", deleteById);

export default router;
