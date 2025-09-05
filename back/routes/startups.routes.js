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

<<<<<<< HEAD
// Update

router.put("/:id", startupsController.update);

=======
>>>>>>> 9039f8e (feat: deletion for some tables)
export default router;