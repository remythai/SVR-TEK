import express from "express";
import * as usersController from "../controllers/users.controller.js"

const router = express.Router();

router.get("/", usersController.getAll);
router.get("/:id", usersController.getById);
router.get("/email/:email", usersController.getByEmail);
router.get("/:id/image", usersController.getUserImage);
router.post("/register", usersController.register);

export default router;