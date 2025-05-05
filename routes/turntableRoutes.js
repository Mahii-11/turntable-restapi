const express = require("express");
const {
  getAllTurntables,
  createTurntable,
  updateTurntable,
  deleteTurntable,
} = require("../controllers/turntableController");

const { protect, adminOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getAllTurntables);
router.post("/", protect, adminOnly, createTurntable);
router.put("/:id", protect, adminOnly, updateTurntable);
router.delete("/:id", protect, adminOnly, deleteTurntable);

module.exports = router;
