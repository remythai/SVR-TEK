import express from "express";
import * as newsController from "../controllers/news.controller.js"

const router = express.Router();

// ----------
// -- Read --
// ----------

router.get("/", newsController.getAll);
router.get("/:id", newsController.getById);
router.get("/:id/image", newsController.getNewsImage);

// ------------
// -- Create --
// ------------

router.post("/", newsController.create);

// ------------
// -- Delete --
// ------------

router.delete("/:id", newsController.deleteById);

// Update

router.put("/:id", newsController.update);

export default router;