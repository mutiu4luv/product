const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/product.model.js");
const cors = require("cors");
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

app.post("/api/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// GET PRODUCTS BY ID

app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// UPDATE A PRODUCT

app.put("/api/product/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, req.body);
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    const updatedProduct = await Product.findById(id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE A PRODUCT

app.delete("/api/product/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    res.status(200).json({ message: "Product Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("hello from NODE API ");
});

mongoose
  .connect(
    "mongodb+srv://chidiemmamadu:MQiv9vWZn7yDAxEP@mutiu.dt5fq.mongodb.net/"
  )
  .then(() => {
    console.log("database connected");
  })
  .catch(() => {
    console.log("failed to connect to database");
  });
