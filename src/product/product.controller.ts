import { Response, Request } from "express";
import mongoose from "mongoose";
import Product, { IProduct } from '../product/product.model.js';
import { 
  ProductParams, 
  ManufacturerParams,
  IProductRequest, 
  IProductUpdateRequest,
  ApiResponse 
} from './product.types.js';

export async function getAllProducts(req: Request, res: Response<ApiResponse<IProduct[]>>): Promise<void> {
  try {
    const products: IProduct[] = await Product.find();
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
}

export async function getProductById(req: Request<ProductParams>, res: Response<ApiResponse<IProduct>>): Promise<void> {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
      return;
    }

    const product: IProduct | null = await Product.findById(id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
}

export async function createProduct(req: Request<{}, ApiResponse<IProduct>, IProductRequest>, res: Response<ApiResponse<IProduct>>): Promise<void> {
  try {
    const productData: IProductRequest = req.body;

    if (!productData.manufacturer || !productData.manufacturer.contact) {
      res.status(400).json({
        success: false,
        message: 'Manufacturer and contact information are required'
      });
      return;
    }

    const newProduct = new Product(productData);
    const savedProduct: IProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct
    });

  } catch (error: any) {
    console.error('Error creating product:', error);

    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors: string[] = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
      return;
    }

    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Product with this SKU already exists'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create product'
    });
  }
}

export async function updateProductById(req: Request<ProductParams, ApiResponse<IProduct>, IProductUpdateRequest>, res: Response<ApiResponse<IProduct>>): Promise<void> {
  try {
    const { id } = req.params;
    const updates: IProductUpdateRequest = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
      return;
    }

    const updatedProduct: IProduct | null = await Product.findByIdAndUpdate(
      id,
      updates,
      { 
        new: true,
        runValidators: true
      }
    );

    if (!updatedProduct) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });

  } catch (error: any) {
    console.error('Error updating product:', error);

    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors: string[] = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
      return;
    }

    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Product with this SKU already exists'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    });
  }
}

export async function deleteProductById(req: Request<ProductParams>, res: Response<ApiResponse<IProduct>>): Promise<void> {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
      return;
    }

    const deletedProduct: IProduct | null = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: deletedProduct
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
}

export async function getProductsByManufacturer(req: Request<ManufacturerParams>, res: Response<ApiResponse<IProduct[]>>): Promise<void> {
  try {
    const { manufacturer } = req.params;
    
    const products: IProduct[] = await Product.find({ 
      'manufacturer.name': new RegExp(manufacturer, 'i') 
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });

  } catch (error) {
    console.error('Error fetching products by manufacturer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products by manufacturer'
    });
  }
}

export async function getProductsByCategory(req: Request<{ category: string }>, res: Response<ApiResponse<IProduct[]>>): Promise<void> {
  try {
    const { category } = req.params;
    
    const products: IProduct[] = await Product.find({ 
      category: new RegExp(category, 'i') 
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });

  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products by category'
    });
  }
}

export async function searchProducts(req: Request, res: Response<ApiResponse<IProduct[]>>): Promise<void> {
  try {
    const { 
      name, 
      category, 
      manufacturer: manufacturerName, 
      minPrice, 
      maxPrice,
      inStock 
    } = req.query;

    const filter: any = {};

    if (name) {
      filter.name = new RegExp(name as string, 'i');
    }

    if (category) {
      filter.category = new RegExp(category as string, 'i');
    }

    if (manufacturerName) {
      filter['manufacturer.name'] = new RegExp(manufacturerName as string, 'i');
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (inStock === 'true') {
      filter.amountInStock = { $gt: 0 };
    }

    const products: IProduct[] = await Product.find(filter);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });

  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search products'
    });
  }
}