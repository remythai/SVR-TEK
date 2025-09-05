import express from "express";
import * as eventsController from "../controllers/events.controller.js"

const router = express.Router();

// ----------
// -- Read --
// ----------

router.get("/", eventsController.getAll);
router.get("/:id", eventsController.getById);
router.get("/:id/image", eventsController.getEventImage);

// ------------
// -- Create --
// ------------

router.post("/", eventsController.create);

// ------------
// -- Delete --
// ------------

router.delete("/:id", eventsController.deleteById);

// Update

router.put("/:id", eventsController.update);

export default router;