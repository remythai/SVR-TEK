import express from "express";
import * as startupsController from "../controllers/startups.controller.js";

const router = express.Router();

router.get("/", startupsController.getAll);
router.get("/:id", startupsController.getById);
router.get("/:startup_id/founders/:founder_id/image", startupsController.getFounderImage);

router.post("/", startupsController.create);

export default router;