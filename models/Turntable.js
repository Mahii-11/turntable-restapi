const mongoose = require("mongoose");

const turntableSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  features: [String],
  specifications: {
    speed: [String],
    platter: String,
    driveType: String,
    output: [String],
  },
  discount: {
    percent: { type: Number, default: 0 },
    validTill: Date,
  },
  warranty: { type: String, default: "1 year limited warranty" },
  /* reviews: [
    {
      userId: String,
      comment: String,
      rating: Number,
      createdAt: { type: Date, default: Date.now },
    },
  ],*/
  // createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Turntable", turntableSchema);
