const express = require("express");
const {
  getAllParts,
  createPart,
  updatePart,
  deletePart,
} = require("../controllers/turntableMenuController");

const { protect, adminOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getAllParts);
router.post("/", protect, adminOnly, createPart);
router.put("/:id", protect, adminOnly, updatePart);
router.delete("/:id", protect, adminOnly, deletePart);

module.exports = router;
