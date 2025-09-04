import express from "express";
import * as usersController from "../controllers/users.controller.js"

const router = express.Router();

// ----------
// -- Read --
// ----------

router.get("/", usersController.getAll);
router.get("/:id", usersController.getById);
router.get("/email/:email", usersController.getByEmail);
router.get("/:id/image", usersController.getUserImage);

// ------------
// -- Create --
// ------------

router.post("/", usersController.create);
router.post("/register", usersController.register);
router.post("/login", usersController.login);

// ------------
// -- Delete --
// ------------

router.delete("/:id", usersController.deleteById);

export default router;