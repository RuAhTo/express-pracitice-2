// product.routes.ts
import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
  getProductsByManufacturer,
  getProductsByCategory,
  searchProducts
} from './product.controller.js';

const router = express.Router();

// Search routes (must come before parameterized routes)
router.get('/search', searchProducts);
router.get('/manufacturer/:manufacturer', getProductsByManufacturer);
router.get('/category/:category', getProductsByCategory);

// CRUD routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProductById);
router.delete('/:id', deleteProductById);

export default router;