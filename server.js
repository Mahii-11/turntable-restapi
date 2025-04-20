const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 50010;

app.use(cors());
app.use(express.json());

// ✅ Mongoose Connection
const uri = process.env.MONGO_URI;

mongoose
  .connect(uri)
  .then(() => console.log("✅ Mongoose connected to MongoDB."))
  .catch((err) => {
    console.error("❌ Mongoose connection error:", err);
    process.exit(1);
  });

// ✅ Then your Order Schema...
const orderSchema = new mongoose.Schema({
  id: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  customer: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, default: "pending" },
  cart: { type: Array, required: true },
  orderPrice: { type: Number, required: true },
  priority: { type: Boolean, default: false },
  priorityPrice: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  estimatedDelivery: { type: String, required: true },
});

const Order = mongoose.model("Order", orderSchema);

// Check Email Credentials
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error(
    "⚠️ Missing EMAIL_USER or EMAIL_PASS in environment variables!"
  );
  process.exit(1);
}

// Dummy product (could be fetched from MongoDB in the future)
const turntable = [
  {
    id: "1",
    name: "Audio-Technica AT-LP120XUSB",
    brand: "Audio-Technica",
    price: 249.99,
    image: "https://turntable-pi.vercel.app/images/turntable-1.jpg",
    description:
      "High-fidelity turntable with USB output and direct-drive mechanism.",
    category: "Direct Drive",
    stock: 15,
    rating: 4.7,
    features: [
      "USB output",
      "Built-in phono preamp",
      "Adjustable tracking force",
      "Anti-skate control",
    ],
    specifications: {
      speed: ["33 1/3 RPM", "45 RPM", "78 RPM"],
      platter: "Die-cast aluminum",
      driveType: "Direct Drive",
      output: ["RCA", "USB"],
    },
    discount: {
      percent: 10,
      validTill: "2025-05-15T23:59:59Z",
    },
    warranty: "1 year limited warranty",
    reviews: [
      {
        userId: "user123",
        comment: "Absolutely love the sound quality and build!",
        rating: 5,
        createdAt: "2025-04-05T14:23:00Z",
      },
      {
        userId: "user789",
        comment: "USB output was a game changer for my setup.",
        rating: 4,
        createdAt: "2025-03-28T10:45:00Z",
      },
    ],
    createdAt: "2025-04-01T12:00:00Z",
  },
  {
    id: "2",
    name: "Audio-Technica AT-LP120XUSB",
    brand: "Audio-Technica",
    price: 249.99,
    image: "https://turntable-pi.vercel.app/images/turntable-2.jpg",
    description:
      "High-fidelity turntable with USB output and direct-drive mechanism.",
    category: "Direct Drive",
    stock: 15,
    soldOut: true,
    rating: 4.7,
    features: [
      "USB output",
      "Built-in phono preamp",
      "Adjustable tracking force",
      "Anti-skate control",
    ],
    specifications: {
      speed: ["33 1/3 RPM", "45 RPM", "78 RPM"],
      platter: "Die-cast aluminum",
      driveType: "Direct Drive",
      output: ["RCA", "USB"],
    },
    discount: {
      percent: 10,
      validTill: "2025-05-15T23:59:59Z",
    },
    warranty: "1 year limited warranty",
    reviews: [
      {
        userId: "user123",
        comment: "Absolutely love the sound quality and build!",
        rating: 5,
        createdAt: "2025-04-05T14:23:00Z",
      },
      {
        userId: "user789",
        comment: "USB output was a game changer for my setup.",
        rating: 4,
        createdAt: "2025-03-28T10:45:00Z",
      },
    ],
    createdAt: "2025-04-01T12:00:00Z",
  },
  {
    id: "3",
    name: "Audio-Technica AT-LP120XUSB",
    brand: "Audio-Technica",
    price: 249.99,
    image: "https://turntable-pi.vercel.app/images/turntable-3.jpg",
    description:
      "High-fidelity turntable with USB output and direct-drive mechanism.",
    category: "Direct Drive",
    stock: 15,
    rating: 4.7,
    features: [
      "USB output",
      "Built-in phono preamp",
      "Adjustable tracking force",
      "Anti-skate control",
    ],
    specifications: {
      speed: ["33 1/3 RPM", "45 RPM", "78 RPM"],
      platter: "Die-cast aluminum",
      driveType: "Direct Drive",
      output: ["RCA", "USB"],
    },
    discount: {
      percent: 10,
      validTill: "2025-05-15T23:59:59Z",
    },
    warranty: "1 year limited warranty",
    reviews: [
      {
        userId: "user123",
        comment: "Absolutely love the sound quality and build!",
        rating: 5,
        createdAt: "2025-04-05T14:23:00Z",
      },
      {
        userId: "user789",
        comment: "USB output was a game changer for my setup.",
        rating: 4,
        createdAt: "2025-03-28T10:45:00Z",
      },
    ],
    createdAt: "2025-04-01T12:00:00Z",
  },
  {
    id: "4",
    name: "Audio-Technica AT-LP120XUSB",
    brand: "Audio-Technica",
    price: 249.99,
    image: "https://turntable-pi.vercel.app/images/turntable-4.jpg",
    description:
      "High-fidelity turntable with USB output and direct-drive mechanism.",
    category: "Direct Drive",
    stock: 15,
    rating: 4.7,
    features: [
      "USB output",
      "Built-in phono preamp",
      "Adjustable tracking force",
      "Anti-skate control",
    ],
    specifications: {
      speed: ["33 1/3 RPM", "45 RPM", "78 RPM"],
      platter: "Die-cast aluminum",
      driveType: "Direct Drive",
      output: ["RCA", "USB"],
    },
    discount: {
      percent: 10,
      validTill: "2025-05-15T23:59:59Z",
    },
    warranty: "1 year limited warranty",
    reviews: [
      {
        userId: "user123",
        comment: "Absolutely love the sound quality and build!",
        rating: 5,
        createdAt: "2025-04-05T14:23:00Z",
      },
      {
        userId: "user789",
        comment: "USB output was a game changer for my setup.",
        rating: 4,
        createdAt: "2025-03-28T10:45:00Z",
      },
    ],
    createdAt: "2025-04-01T12:00:00Z",
  },
  {
    id: "5",
    name: "Audio-Technica AT-LP120XUSB",
    brand: "Audio-Technica",
    price: 249.99,
    image: "https://turntable-pi.vercel.app/images/turntable-5.jpg",
    description:
      "High-fidelity turntable with USB output and direct-drive mechanism.",
    category: "Direct Drive",
    stock: 15,
    rating: 4.7,
    features: [
      "USB output",
      "Built-in phono preamp",
      "Adjustable tracking force",
      "Anti-skate control",
    ],
    specifications: {
      speed: ["33 1/3 RPM", "45 RPM", "78 RPM"],
      platter: "Die-cast aluminum",
      driveType: "Direct Drive",
      output: ["RCA", "USB"],
    },
    discount: {
      percent: 10,
      validTill: "2025-05-15T23:59:59Z",
    },
    warranty: "1 year limited warranty",
    reviews: [
      {
        userId: "user123",
        comment: "Absolutely love the sound quality and build!",
        rating: 5,
        createdAt: "2025-04-05T14:23:00Z",
      },
      {
        userId: "user789",
        comment: "USB output was a game changer for my setup.",
        rating: 4,
        createdAt: "2025-03-28T10:45:00Z",
      },
    ],
    createdAt: "2025-04-01T12:00:00Z",
  },
  {
    id: "6",
    name: "Audio-Technica AT-LP120XUSB",
    brand: "Audio-Technica",
    price: 249.99,
    image: "https://turntable-pi.vercel.app/images/turntable-6.jpg",
    description:
      "High-fidelity turntable with USB output and direct-drive mechanism.",
    category: "Direct Drive",
    stock: 15,
    rating: 4.7,
    features: [
      "USB output",
      "Built-in phono preamp",
      "Adjustable tracking force",
      "Anti-skate control",
    ],
    specifications: {
      speed: ["33 1/3 RPM", "45 RPM", "78 RPM"],
      platter: "Die-cast aluminum",
      driveType: "Direct Drive",
      output: ["RCA", "USB"],
    },
    discount: {
      percent: 10,
      validTill: "2025-05-15T23:59:59Z",
    },
    warranty: "1 year limited warranty",
    reviews: [
      {
        userId: "user123",
        comment: "Absolutely love the sound quality and build!",
        rating: 5,
        createdAt: "2025-04-05T14:23:00Z",
      },
      {
        userId: "user789",
        comment: "USB output was a game changer for my setup.",
        rating: 4,
        createdAt: "2025-03-28T10:45:00Z",
      },
    ],
    createdAt: "2025-04-01T12:00:00Z",
  },
  {
    id: "7",
    name: "Audio-Technica AT-LP120XUSB",
    brand: "Audio-Technica",
    price: 249.99,
    image: "https://turntable-pi.vercel.app/images/turntable-7.jpg",
    description:
      "High-fidelity turntable with USB output and direct-drive mechanism.",
    category: "Direct Drive",
    stock: 15,
    rating: 4.7,
    features: [
      "USB output",
      "Built-in phono preamp",
      "Adjustable tracking force",
      "Anti-skate control",
    ],
    specifications: {
      speed: ["33 1/3 RPM", "45 RPM", "78 RPM"],
      platter: "Die-cast aluminum",
      driveType: "Direct Drive",
      output: ["RCA", "USB"],
    },
    discount: {
      percent: 10,
      validTill: "2025-05-15T23:59:59Z",
    },
    warranty: "1 year limited warranty",
    reviews: [
      {
        userId: "user123",
        comment: "Absolutely love the sound quality and build!",
        rating: 5,
        createdAt: "2025-04-05T14:23:00Z",
      },
      {
        userId: "user789",
        comment: "USB output was a game changer for my setup.",
        rating: 4,
        createdAt: "2025-03-28T10:45:00Z",
      },
    ],
    createdAt: "2025-04-01T12:00:00Z",
  },
  {
    id: "8",
    name: "Audio-Technica AT-LP120XUSB",
    brand: "Audio-Technica",
    price: 249.99,
    image: "https://turntable-pi.vercel.app/images/turntable-8.jpg",
    description:
      "High-fidelity turntable with USB output and direct-drive mechanism.",
    category: "Direct Drive",
    stock: 15,
    rating: 4.7,
    features: [
      "USB output",
      "Built-in phono preamp",
      "Adjustable tracking force",
      "Anti-skate control",
    ],
    specifications: {
      speed: ["33 1/3 RPM", "45 RPM", "78 RPM"],
      platter: "Die-cast aluminum",
      driveType: "Direct Drive",
      output: ["RCA", "USB"],
    },
    discount: {
      percent: 10,
      validTill: "2025-05-15T23:59:59Z",
    },
    warranty: "1 year limited warranty",
    reviews: [
      {
        userId: "user123",
        comment: "Absolutely love the sound quality and build!",
        rating: 5,
        createdAt: "2025-04-05T14:23:00Z",
      },
      {
        userId: "user789",
        comment: "USB output was a game changer for my setup.",
        rating: 4,
        createdAt: "2025-03-28T10:45:00Z",
      },
    ],
    createdAt: "2025-04-01T12:00:00Z",
  },

  {
    id: "9",
    name: "Audio-Technica AT-LP120XUSB",
    brand: "Audio-Technica",
    price: 249.99,
    image: "https://turntable-pi.vercel.app/images/turntable-9.jpg",
    description:
      "High-fidelity turntable with USB output and direct-drive mechanism.",
    category: "Direct Drive",
    stock: 15,
    rating: 4.7,
    features: [
      "USB output",
      "Built-in phono preamp",
      "Adjustable tracking force",
      "Anti-skate control",
    ],
    specifications: {
      speed: ["33 1/3 RPM", "45 RPM", "78 RPM"],
      platter: "Die-cast aluminum",
      driveType: "Direct Drive",
      output: ["RCA", "USB"],
    },
    discount: {
      percent: 10,
      validTill: "2025-05-15T23:59:59Z",
    },
    warranty: "1 year limited warranty",
    reviews: [
      {
        userId: "user123",
        comment: "Absolutely love the sound quality and build!",
        rating: 5,
        createdAt: "2025-04-05T14:23:00Z",
      },
      {
        userId: "user789",
        comment: "USB output was a game changer for my setup.",
        rating: 4,
        createdAt: "2025-03-28T10:45:00Z",
      },
    ],
    createdAt: "2025-04-01T12:00:00Z",
  },
  {
    id: "10",
    name: "Audio-Technica AT-LP120XUSB",
    brand: "Audio-Technica",
    price: 249.99,
    image: "https://turntable-pi.vercel.app/images/turntable-10.jpg",
    description:
      "High-fidelity turntable with USB output and direct-drive mechanism.",
    category: "Direct Drive",
    stock: 15,
    rating: 4.7,
    features: [
      "USB output",
      "Built-in phono preamp",
      "Adjustable tracking force",
      "Anti-skate control",
    ],
    specifications: {
      speed: ["33 1/3 RPM", "45 RPM", "78 RPM"],
      platter: "Die-cast aluminum",
      driveType: "Direct Drive",
      output: ["RCA", "USB"],
    },
    discount: {
      percent: 10,
      validTill: "2025-05-15T23:59:59Z",
    },
    warranty: "1 year limited warranty",
    reviews: [
      {
        userId: "user123",
        comment: "Absolutely love the sound quality and build!",
        rating: 5,
        createdAt: "2025-04-05T14:23:00Z",
      },
      {
        userId: "user789",
        comment: "USB output was a game changer for my setup.",
        rating: 4,
        createdAt: "2025-03-28T10:45:00Z",
      },
    ],
    createdAt: "2025-04-01T12:00:00Z",
  },
  {
    id: "11",
    name: "Audio-Technica AT-LP120XUSB",
    brand: "Audio-Technica",
    price: 249.99,
    image: "https://turntable-pi.vercel.app/images/turntable-11.jpg",
    description:
      "High-fidelity turntable with USB output and direct-drive mechanism.",
    category: "Direct Drive",
    stock: 15,
    rating: 4.7,
    features: [
      "USB output",
      "Built-in phono preamp",
      "Adjustable tracking force",
      "Anti-skate control",
    ],
    specifications: {
      speed: ["33 1/3 RPM", "45 RPM", "78 RPM"],
      platter: "Die-cast aluminum",
      driveType: "Direct Drive",
      output: ["RCA", "USB"],
    },
    discount: {
      percent: 10,
      validTill: "2025-05-15T23:59:59Z",
    },
    warranty: "1 year limited warranty",
    reviews: [
      {
        userId: "user123",
        comment: "Absolutely love the sound quality and build!",
        rating: 5,
        createdAt: "2025-04-05T14:23:00Z",
      },
      {
        userId: "user789",
        comment: "USB output was a game changer for my setup.",
        rating: 4,
        createdAt: "2025-03-28T10:45:00Z",
      },
    ],
    createdAt: "2025-04-01T12:00:00Z",
  },
  {
    id: "12",
    name: "Audio-Technica AT-LP120XUSB",
    brand: "Audio-Technica",
    price: 249.99,
    image: "https://turntable-pi.vercel.app/images/turntable-12.jpg",
    description:
      "High-fidelity turntable with USB output and direct-drive mechanism.",
    category: "Direct Drive",
    stock: 15,
    rating: 4.7,
    features: [
      "USB output",
      "Built-in phono preamp",
      "Adjustable tracking force",
      "Anti-skate control",
    ],
    specifications: {
      speed: ["33 1/3 RPM", "45 RPM", "78 RPM"],
      platter: "Die-cast aluminum",
      driveType: "Direct Drive",
      output: ["RCA", "USB"],
    },
    discount: {
      percent: 10,
      validTill: "2025-05-15T23:59:59Z",
    },
    warranty: "1 year limited warranty",
    reviews: [
      {
        userId: "user123",
        comment: "Absolutely love the sound quality and build!",
        rating: 5,
        createdAt: "2025-04-05T14:23:00Z",
      },
      {
        userId: "user789",
        comment: "USB output was a game changer for my setup.",
        rating: 4,
        createdAt: "2025-03-28T10:45:00Z",
      },
    ],
    createdAt: "2025-04-01T12:00:00Z",
  },
  {
    id: "13",
    name: "Audio-Technica AT-LP120XUSB",
    brand: "Audio-Technica",
    price: 249.99,
    image: "https://turntable-pi.vercel.app/images/turntable-13.jpg",
    description:
      "High-fidelity turntable with USB output and direct-drive mechanism.",
    category: "Direct Drive",
    stock: 15,
    rating: 4.7,
    features: [
      "USB output",
      "Built-in phono preamp",
      "Adjustable tracking force",
      "Anti-skate control",
    ],
    specifications: {
      speed: ["33 1/3 RPM", "45 RPM", "78 RPM"],
      platter: "Die-cast aluminum",
      driveType: "Direct Drive",
      output: ["RCA", "USB"],
    },
    discount: {
      percent: 10,
      validTill: "2025-05-15T23:59:59Z",
    },
    warranty: "1 year limited warranty",
    reviews: [
      {
        userId: "user123",
        comment: "Absolutely love the sound quality and build!",
        rating: 5,
        createdAt: "2025-04-05T14:23:00Z",
      },
      {
        userId: "user789",
        comment: "USB output was a game changer for my setup.",
        rating: 4,
        createdAt: "2025-03-28T10:45:00Z",
      },
    ],
    createdAt: "2025-04-01T12:00:00Z",
  },
  {
    id: "14",
    name: "Audio-Technica AT-LP120XUSB",
    brand: "Audio-Technica",
    price: 249.99,
    image: "https://turntable-pi.vercel.app/images/turntable-14.jpg",
    description:
      "High-fidelity turntable with USB output and direct-drive mechanism.",
    category: "Direct Drive",
    stock: 15,
    rating: 4.7,
    features: [
      "USB output",
      "Built-in phono preamp",
      "Adjustable tracking force",
      "Anti-skate control",
    ],
    specifications: {
      speed: ["33 1/3 RPM", "45 RPM", "78 RPM"],
      platter: "Die-cast aluminum",
      driveType: "Direct Drive",
      output: ["RCA", "USB"],
    },
    discount: {
      percent: 10,
      validTill: "2025-05-15T23:59:59Z",
    },
    warranty: "1 year limited warranty",
    reviews: [
      {
        userId: "user123",
        comment: "Absolutely love the sound quality and build!",
        rating: 5,
        createdAt: "2025-04-05T14:23:00Z",
      },
      {
        userId: "user789",
        comment: "USB output was a game changer for my setup.",
        rating: 4,
        createdAt: "2025-03-28T10:45:00Z",
      },
    ],
    createdAt: "2025-04-01T12:00:00Z",
  },
  {
    id: "15",
    name: "Audio-Technica AT-LP120XUSB",
    brand: "Audio-Technica",
    price: 249.99,
    image: "https://turntable-pi.vercel.app/images/turntable-15.jpg",
    description:
      "High-fidelity turntable with USB output and direct-drive mechanism.",
    category: "Direct Drive",
    stock: 15,
    rating: 4.7,
    features: [
      "USB output",
      "Built-in phono preamp",
      "Adjustable tracking force",
      "Anti-skate control",
    ],
    specifications: {
      speed: ["33 1/3 RPM", "45 RPM", "78 RPM"],
      platter: "Die-cast aluminum",
      driveType: "Direct Drive",
      output: ["RCA", "USB"],
    },
    discount: {
      percent: 10,
      validTill: "2025-05-15T23:59:59Z",
    },
    warranty: "1 year limited warranty",
    reviews: [
      {
        userId: "user123",
        comment: "Absolutely love the sound quality and build!",
        rating: 5,
        createdAt: "2025-04-05T14:23:00Z",
      },
      {
        userId: "user789",
        comment: "USB output was a game changer for my setup.",
        rating: 4,
        createdAt: "2025-03-28T10:45:00Z",
      },
    ],
    createdAt: "2025-04-01T12:00:00Z",
  },
  {
    id: "16",
    name: "Audio-Technica AT-LP120XUSB",
    brand: "Audio-Technica",
    price: 249.99,
    image: "https://turntable-pi.vercel.app/images/turntable-16.jpg",
    description:
      "High-fidelity turntable with USB output and direct-drive mechanism.",
    category: "Direct Drive",
    stock: 15,
    rating: 4.7,
    features: [
      "USB output",
      "Built-in phono preamp",
      "Adjustable tracking force",
      "Anti-skate control",
    ],
    specifications: {
      speed: ["33 1/3 RPM", "45 RPM", "78 RPM"],
      platter: "Die-cast aluminum",
      driveType: "Direct Drive",
      output: ["RCA", "USB"],
    },
    discount: {
      percent: 10,
      validTill: "2025-05-15T23:59:59Z",
    },
    warranty: "1 year limited warranty",
    reviews: [
      {
        userId: "user123",
        comment: "Absolutely love the sound quality and build!",
        rating: 5,
        createdAt: "2025-04-05T14:23:00Z",
      },
      {
        userId: "user789",
        comment: "USB output was a game changer for my setup.",
        rating: 4,
        createdAt: "2025-03-28T10:45:00Z",
      },
    ],
    createdAt: "2025-04-01T12:00:00Z",
  },
  {
    id: "17",
    name: "Audio-Technica AT-LP120XUSB",
    brand: "Audio-Technica",
    price: 249.99,
    image: "https://turntable-pi.vercel.app/images/turntable-17.jpg",
    description:
      "High-fidelity turntable with USB output and direct-drive mechanism.",
    category: "Direct Drive",
    stock: 15,
    rating: 4.7,
    features: [
      "USB output",
      "Built-in phono preamp",
      "Adjustable tracking force",
      "Anti-skate control",
    ],
    specifications: {
      speed: ["33 1/3 RPM", "45 RPM", "78 RPM"],
      platter: "Die-cast aluminum",
      driveType: "Direct Drive",
      output: ["RCA", "USB"],
    },
    discount: {
      percent: 10,
      validTill: "2025-05-15T23:59:59Z",
    },
    warranty: "1 year limited warranty",
    reviews: [
      {
        userId: "user123",
        comment: "Absolutely love the sound quality and build!",
        rating: 5,
        createdAt: "2025-04-05T14:23:00Z",
      },
      {
        userId: "user789",
        comment: "USB output was a game changer for my setup.",
        rating: 4,
        createdAt: "2025-03-28T10:45:00Z",
      },
    ],
    createdAt: "2025-04-01T12:00:00Z",
  },
  {
    id: "18",
    name: "Audio-Technica AT-LP120XUSB",
    brand: "Audio-Technica",
    price: 249.99,
    image: "https://turntable-pi.vercel.app/images/turntable-18.jpg",
    description:
      "High-fidelity turntable with USB output and direct-drive mechanism.",
    category: "Direct Drive",
    stock: 15,
    rating: 4.7,
    features: [
      "USB output",
      "Built-in phono preamp",
      "Adjustable tracking force",
      "Anti-skate control",
    ],
    specifications: {
      speed: ["33 1/3 RPM", "45 RPM", "78 RPM"],
      platter: "Die-cast aluminum",
      driveType: "Direct Drive",
      output: ["RCA", "USB"],
    },
    discount: {
      percent: 10,
      validTill: "2025-05-15T23:59:59Z",
    },
    warranty: "1 year limited warranty",
    reviews: [
      {
        userId: "user123",
        comment: "Absolutely love the sound quality and build!",
        rating: 5,
        createdAt: "2025-04-05T14:23:00Z",
      },
      {
        userId: "user789",
        comment: "USB output was a game changer for my setup.",
        rating: 4,
        createdAt: "2025-03-28T10:45:00Z",
      },
    ],
    createdAt: "2025-04-01T12:00:00Z",
  },
  {
    id: "19",
    name: "Audio-Technica AT-LP120XUSB",
    brand: "Audio-Technica",
    price: 249.99,
    image: "https://turntable-pi.vercel.app/images/turntable-19.jpg",
    description:
      "High-fidelity turntable with USB output and direct-drive mechanism.",
    category: "Direct Drive",
    stock: 15,
    rating: 4.7,
    features: [
      "USB output",
      "Built-in phono preamp",
      "Adjustable tracking force",
      "Anti-skate control",
    ],
    specifications: {
      speed: ["33 1/3 RPM", "45 RPM", "78 RPM"],
      platter: "Die-cast aluminum",
      driveType: "Direct Drive",
      output: ["RCA", "USB"],
    },
    discount: {
      percent: 10,
      validTill: "2025-05-15T23:59:59Z",
    },
    warranty: "1 year limited warranty",
    reviews: [
      {
        userId: "user123",
        comment: "Absolutely love the sound quality and build!",
        rating: 5,
        createdAt: "2025-04-05T14:23:00Z",
      },
      {
        userId: "user789",
        comment: "USB output was a game changer for my setup.",
        rating: 4,
        createdAt: "2025-03-28T10:45:00Z",
      },
    ],
    createdAt: "2025-04-01T12:00:00Z",
  },
  {
    id: "20",
    name: "Audio-Technica AT-LP120XUSB",
    brand: "Audio-Technica",
    price: 249.99,
    image: "https://turntable-pi.vercel.app/images/turntable-20.jpg",
    description:
      "High-fidelity turntable with USB output and direct-drive mechanism.",
    category: "Direct Drive",
    stock: 15,
    rating: 4.7,
    features: [
      "USB output",
      "Built-in phono preamp",
      "Adjustable tracking force",
      "Anti-skate control",
    ],
    specifications: {
      speed: ["33 1/3 RPM", "45 RPM", "78 RPM"],
      platter: "Die-cast aluminum",
      driveType: "Direct Drive",
      output: ["RCA", "USB"],
    },
    discount: {
      percent: 10,
      validTill: "2025-05-15T23:59:59Z",
    },
    warranty: "1 year limited warranty",
    reviews: [
      {
        userId: "user123",
        comment: "Absolutely love the sound quality and build!",
        rating: 5,
        createdAt: "2025-04-05T14:23:00Z",
      },
      {
        userId: "user789",
        comment: "USB output was a game changer for my setup.",
        rating: 4,
        createdAt: "2025-03-28T10:45:00Z",
      },
    ],
    createdAt: "2025-04-01T12:00:00Z",
  },
  {
    id: "21",
    name: "Audio-Technica AT-LP120XUSB",
    brand: "Audio-Technica",
    price: 249.99,
    image: "https://turntable-pi.vercel.app/images/turntable-21.jpg",
    description:
      "High-fidelity turntable with USB output and direct-drive mechanism.",
    category: "Direct Drive",
    stock: 15,
    rating: 4.7,
    features: [
      "USB output",
      "Built-in phono preamp",
      "Adjustable tracking force",
      "Anti-skate control",
    ],
    specifications: {
      speed: ["33 1/3 RPM", "45 RPM", "78 RPM"],
      platter: "Die-cast aluminum",
      driveType: "Direct Drive",
      output: ["RCA", "USB"],
    },
    discount: {
      percent: 10,
      validTill: "2025-05-15T23:59:59Z",
    },
    warranty: "1 year limited warranty",
    reviews: [
      {
        userId: "user123",
        comment: "Absolutely love the sound quality and build!",
        rating: 5,
        createdAt: "2025-04-05T14:23:00Z",
      },
      {
        userId: "user789",
        comment: "USB output was a game changer for my setup.",
        rating: 4,
        createdAt: "2025-03-28T10:45:00Z",
      },
    ],
    createdAt: "2025-04-01T12:00:00Z",
  },
  {
    id: "22",
    name: "Audio-Technica AT-LP120XUSB",
    brand: "Audio-Technica",
    price: 249.99,
    image: "https://turntable-pi.vercel.app/images/turntable-22.jpg",
    description:
      "High-fidelity turntable with USB output and direct-drive mechanism.",
    category: "Direct Drive",
    stock: 15,
    rating: 4.7,
    features: [
      "USB output",
      "Built-in phono preamp",
      "Adjustable tracking force",
      "Anti-skate control",
    ],
    specifications: {
      speed: ["33 1/3 RPM", "45 RPM", "78 RPM"],
      platter: "Die-cast aluminum",
      driveType: "Direct Drive",
      output: ["RCA", "USB"],
    },
    discount: {
      percent: 10,
      validTill: "2025-05-15T23:59:59Z",
    },
    warranty: "1 year limited warranty",
    reviews: [
      {
        userId: "user123",
        comment: "Absolutely love the sound quality and build!",
        rating: 5,
        createdAt: "2025-04-05T14:23:00Z",
      },
      {
        userId: "user789",
        comment: "USB output was a game changer for my setup.",
        rating: 4,
        createdAt: "2025-03-28T10:45:00Z",
      },
    ],
    createdAt: "2025-04-01T12:00:00Z",
  },
];

app.get("/api/turntable", (req, res) => {
  res.status(200).json({ status: "success", data: turntable });
});

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate a random order ID
function generateRandomId() {
  return "ORD" + Math.random().toString(36).substring(2, 7).toUpperCase();
}

// -------------------- ROUTES -------------------- //

// ✅ Create New Order
app.post("/api/order", async (req, res) => {
  console.log("Received Data:", req.body);
  const {
    address,
    phone,
    customer,
    email,
    cart = [],
    priority = false,
  } = req.body;

  if (!address || !phone || !customer || !email) {
    return res
      .status(400)
      .json({ status: "fail", message: "Missing required fields" });
  }

  const orderPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const priorityPrice = priority ? 30 : 0;

  const estimatedDelivery = new Date();
  estimatedDelivery.setMinutes(estimatedDelivery.getMinutes() + 30);

  const newOrder = new Order({
    id: generateRandomId(),
    address,
    email,
    phone,
    customer,
    status: req.body.status || "pending",
    cart,
    orderPrice,
    priority,
    priorityPrice,
    totalPrice: orderPrice + priorityPrice,
    estimatedDelivery: estimatedDelivery.toISOString(),
  });

  try {
    await newOrder.save(); // Save order to MongoDB
    res.status(201).json({ status: "success", data: newOrder });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Admin email
      cc: email, // Customer email
      subject: "New Order Received! 📦",
      text: `New order received!\n\nCustomer: ${customer}\nEmail: ${email}\nPhone: ${phone}\nAddress: ${address}\nTotal Price: ${orderPrice}\nOrderId: ${id}\nCheck the dashboard for more details.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📩 Order notification email sent to Admin & ${email}`);
  } catch (error) {
    console.error("❌ Error saving order to database:", error);
    res.status(500).json({ status: "fail", message: "Error saving order" });
  }
});

// Update Order Status & Send Confirmation Email
app.post("/update-order-status", async (req, res) => {
  const {
    orderId,
    status,
    customerEmail,
    customerName,
    phone,
    address,
    orderDetails,
  } = req.body;

  if (!orderId || !status) {
    return res.status(400).json({ success: false, message: "Missing data!" });
  }

  io.emit("order-status-update", { orderId, status });

  // If order is confirmed, send confirmation email
  if (status.toLowerCase() === "confirmed") {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: customerEmail,
        subject: "Your Order is Confirmed! 🎉",
        text: `Dear ${customerName}, 

Great news! 🎉 Your order has been confirmed successfully  

🚀 Estimated Delivery Time: 30 minutes  
📌 Order ID: ${orderId}  
📍 Delivery Address: ${address}  
📞 Contact Number: ${phone}  
🛒 Order Details: ${orderDetails}  

⏳ Please be ready to receive your order. Kindly keep your phone nearby, and make sure your doorbell is working so that our rider can deliver. 🚴‍♂️  

Thank you for choosing **Turntable-BD**! And... If you have any questions, feel free to contact us.  

`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`📩 Confirmation email sent to ${customerEmail}`);
    } catch (error) {
      console.error("❌ Confirmation email error:", error);
    }
  }

  res.status(200).json({
    success: true,
    message: `Order ${orderId} updated to ${status}`,
  });
});

// ✅ Get All Orders
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res
      .status(200)
      .json({ status: "success", total: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Error fetching orders" });
  }
});

// ✅ Get Specific Order by ID
app.get("/api/order/:id", async (req, res) => {
  const orderId = req.params.id;
  try {
    const order = await Order.findOne({ id: orderId });
    if (!order) {
      return res
        .status(404)
        .json({ status: "fail", message: `Couldn't find order #${orderId}` });
    }
    res.status(200).json({ status: "success", data: order });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Error fetching order" });
  }
});

// ✅ Update Order by ID
app.patch("/api/order/:id", async (req, res) => {
  const orderId = req.params.id;
  try {
    const order = await Order.findOneAndUpdate({ id: orderId }, req.body, {
      new: true,
    });
    if (!order) {
      return res
        .status(404)
        .json({ status: "fail", message: "Order not found" });
    }
    res.status(200).json({ status: "success", data: order });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Error updating order" });
  }
});

// ✅ Start Server + WebSocket
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
