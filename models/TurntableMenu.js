const mongoose = require("mongoose");

const turntableMenuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  soldOut: { type: Boolean, default: false },
  stock: { type: Number, required: true },
});

module.exports = mongoose.model("TurntableMenu", turntableMenuSchema);
