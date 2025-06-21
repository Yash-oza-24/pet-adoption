const petController = require("../controllers/petController");
const express = require("express");
const authenticateUser = require("../middleware/authMiddleware");
const router = express.Router();

router.post(
  "/add",
  petController.upload.array("images"),
  authenticateUser,
  petController.createPet
);
router.get("/all", petController.getPets);
router.get("/:id", petController.getPetById);
router.put(
  "/update/:id",
  authenticateUser,
  petController.upload.array("images"),
  petController.updatePet
);
router.delete("/delete/:id", authenticateUser, petController.deletePet);

module.exports = router;
