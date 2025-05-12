const TurntableMenu = require("../models/TurntableMenu");

// Create a new turntable menu part
exports.createPart = async (req, res) => {
  try {
    const turntableMenu = new TurntableMenu(req.body);
    await turntableMenu.save();
    res.status(201).json(turntableMenu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTurntablePartsById = async (req, res) => {
  try {
    const turntable = await TurntableMenu.findById(req.params.id);
    if (!turntable) {
      return res.status(404).json({ error: "Turntable not found" });
    }
    res.status(200).json(turntable);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all turntable menu parts
exports.getAllParts = async (req, res) => {
  try {
    const turntableMenu = await TurntableMenu.find();
    res.status(200).json(turntableMenu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a turntable menu part by ID
exports.updatePart = async (req, res) => {
  try {
    const updatedTurntableMenu = await TurntableMenu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedTurntableMenu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a turntable menu part by ID
exports.deletePart = async (req, res) => {
  try {
    await TurntableMenu.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "Turntable menu part deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
