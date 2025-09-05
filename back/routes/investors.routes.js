import express from "express";
import * as investorsController from "../controllers/investors.controller.js"

const router = express.Router();

// ----------
// -- Read --
// ----------

router.get("/", investorsController.getAll);
router.get("/:id", investorsController.getById);
router.get("/:id/image", investorsController.getInvestorImage);

// ------------
// -- Create --
// ------------

router.post("/", investorsController.create);

// ------------
// -- Delete --
// ------------

router.delete("/:id", investorsController.deleteById);

// Update

router.put("/:id", investorsController.update);

export default router;