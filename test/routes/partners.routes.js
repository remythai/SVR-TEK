import express from "express";
import * as partnersController from "../controllers/partners.controller.js"

const router = express.Router();

router.get("/", partnersController.getAll);
router.get("/:id", partnersController.getById);

export default router;