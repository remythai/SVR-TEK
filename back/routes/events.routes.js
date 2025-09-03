import express from "express";
import * as eventsController from "../controllers/events.controller.js"

const router = express.Router();

router.get("/", eventsController.getAll);
router.get("/:id", eventsController.getById);
router.get("/:id/image", eventsController.getEventImage);

router.delete("/:id", eventsController.deleteById);

export default router;