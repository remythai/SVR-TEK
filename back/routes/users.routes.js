import express from "express";
import * as usersController from "../controllers/users.controller.js"
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// ----------
// -- Read --
// ----------
router.get("/", usersController.getAll);
router.get("/email/:email", usersController.getByEmail);

// ------------
// -- Create --
// ------------
router.post("/", usersController.create);

router.post("/register", usersController.register);
router.post("/login", usersController.login);

router.put("/update-password", authenticate, usersController.updatePassword);

router.get("/:id", usersController.getById);
router.get("/:id/image", usersController.getUserImage);
router.put("/:id", usersController.update);
router.delete("/:id", usersController.deleteById);

// ------------
// -- Delete --
// ------------

router.delete("/:id", usersController.deleteById);

// ------------
// -- Delete --
// ------------

router.delete("/:id", usersController.deleteById);

export default router;