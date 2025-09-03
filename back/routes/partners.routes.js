import express from "express";
import * as partnersController from "../controllers/partners.controller.js"

const router = express.Router();

// ----------
// -- Read --
// ----------

router.get("/", partnersController.getAll);
router.get("/:id", partnersController.getById);

// ------------
// -- Create --
// ------------

router.post("/", partnersController.create);

export default router;