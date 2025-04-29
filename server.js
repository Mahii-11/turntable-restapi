const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 50010;

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

const uri = process.env.MONGO_URI;

mongoose
  .connect(uri)
  .then(() => console.log("✅ Mongoose connected to MongoDB."))
  .catch((err) => {
    console.error("❌ Mongoose connection error:", err);
    process.exit(1);
  });

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

const turntableRoutes = require("./routes/turntableRoutes");
const turntableMenuRoutes = require("./routes/turntableMenuRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/turntable", turntableRoutes);
app.use("/api/turntablemenu", turntableMenuRoutes);
app.use("/api/auth", authRoutes);

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error(
    "⚠️ Missing EMAIL_USER or EMAIL_PASS in environment variables!"
  );
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res
      .status(400)
      .json({ status: "fail", message: "All fields are required." });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `📬 New Contact Form Submission: ${subject}`,
    text: `You have a new message from the contact form:

👤 Name: ${name}
📧 Email: ${email}
📝 Subject: ${subject}
💬 Message:
${message}
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📩 Contact message sent from ${email}`);
    res.status(200).json({ status: "success", message: "Message sent!" });
  } catch (error) {
    console.error("❌ Failed to send contact message:", error);
    res
      .status(500)
      .json({ status: "fail", message: "Failed to send message." });
  }
});

function generateRandomId() {
  return "ORD" + Math.random().toString(36).substring(2, 7).toUpperCase();
}

// -------------------- ROUTES -------------------- //

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
    await newOrder.save();
    res.status(201).json({ status: "success", data: newOrder });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      cc: email,
      subject: "New Order Received! 📦",
      text: `New order received!\n\nCustomer: ${customer}\nEmail: ${email}\nPhone: ${phone}\nAddress: ${address}\nTotal Price: ${orderPrice}\nOrder ID: ${newOrder.id}\nCheck the dashboard for more details.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📩 Order notification email sent to Admin & ${email}`);
  } catch (error) {
    console.error("❌ Error saving order to database:", error);
    res.status(500).json({ status: "fail", message: "Error saving order" });
  }
});

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

app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});

//app.get("/", (req, res) => {
// res.send("🎵 Turntable API is running...");
//});
