import express from "express";
import * as investorsController from "../controllers/investors.controller.js"

const router = express.Router();

router.get("/", investorsController.getAll);
router.get("/:id", investorsController.getById);
router.get("/:id/image", investorsController.getInvestorImage);

export default router;