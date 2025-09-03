import express from "express";
import * as startupsController from "../controllers/startups.controller.js";

const router = express.Router();

// ----------
// -- Read --
// ----------

router.get("/", startupsController.getAll);
router.get("/:id", startupsController.getById);
router.get("/:startup_id/founders/:founder_id/image", startupsController.getFounderImage);

// ------------
// -- Create --
// ------------

router.post("/", startupsController.create);

// ------------
// -- Delete --
// ------------

router.delete("/:id", startupsController.deleteById);

export default router;