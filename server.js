const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const verifyToken = require("./middleware/authMiddleware");

dotenv.config();
const app = express();

app.use(express.json());

app.use(cors());

app.use(verifyToken);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes

app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/users", require("./routes/userRoutes"));

app.use("/api/groupcategory", require("./routes/groupRoutes"));

app.use("/api/upi-vendors", require("./routes/upiVendorRoutes"));

app.use("/api/bankaccount", require("./routes/bankAccountRoutes"));

app.use("/api/banks", require("./routes/bankAccountRoutes"));

app.use("/api/transaction", require("./routes/transactionsRoutes"));

app.use("/api/budget", require("./routes/budgetRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));
