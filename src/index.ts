import express from "express";
import mongoose from "mongoose";
import productRoutes from './product/product.routes.js';

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB || "localhost:3000")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use('/api/products', productRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});