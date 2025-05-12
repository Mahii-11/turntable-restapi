const express = require("express");
const {
  getAllParts,
  getTurntablePartsById,
  createPart,
  updatePart,
  deletePart,
} = require("../controllers/turntableMenuController");

const { protect, adminOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getAllParts);
router.get("/:id", getTurntablePartsById);
router.post("/", protect, adminOnly, createPart);
router.put("/:id", protect, adminOnly, updatePart);
router.delete("/:id", protect, adminOnly, deletePart);

module.exports = router;
