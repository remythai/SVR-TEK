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

<<<<<<< HEAD
// ------------
// -- Delete --
// ------------

router.delete("/:id", partnersController.deleteById);

// Update

router.put("/:id", partnersController.update);

=======
>>>>>>> 2bb4f01 (refacto & feat: reafacto with utils functions and add create)
export default router;