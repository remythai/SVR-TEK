import express from "express";
import * as newsController from "../controllers/news.controller.js"

const router = express.Router();

router.get("/", newsController.getAll);
router.get("/:id", newsController.getById);
router.get("/:id/image", newsController.getNewsImage);

export default router;