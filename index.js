const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/product.model.js");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const productRoutes = require("./routes/productRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
app.use(express.json());
app.use(cors());

app.listen(5000, () => {
  console.log("server is running at port 5000");
});

// routes

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("hello from NODE API ");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("database connected");
  })
  .catch(() => {
    console.log("failed to connect to database");
  });
