const mongoose = require("mongoose");

const turntableMenuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  rating: { type: Number, default: 0 },
  soldOut: { type: Boolean, default: false },
  stock: { type: Number, required: true },
  warranty: { type: String, default: "1 year limited warranty" },
  reviews: [
    {
      userId: String,
      comment: String,
      rating: Number,
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("TurntableMenu", turntableMenuSchema);
