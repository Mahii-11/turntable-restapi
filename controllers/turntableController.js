const Turntable = require("../models/Turntable");

// Create a new turntable
exports.createTurntable = async (req, res) => {
  try {
    const turntable = new Turntable(req.body);
    await turntable.save();
    res.status(201).json(turntable);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all turntables
exports.getAllTurntables = async (req, res) => {
  try {
    const turntables = await Turntable.find();
    res.status(200).json(turntables);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a turntable by ID
exports.updateTurntable = async (req, res) => {
  try {
    const updatedTurntable = await Turntable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedTurntable);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a turntable by ID
exports.deleteTurntable = async (req, res) => {
  try {
    await Turntable.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Turntable deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
