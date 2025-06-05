// product.types.ts
export interface ProductParams {
  id: string;
}

export interface ManufacturerParams {
  manufacturer: string;
}

// Request body interfaces
export interface IContactRequest {
  name: string;
  email: string;
  phone: string;
}

export interface IManufacturerRequest {
  name: string;
  country: string;
  website?: string;
  description?: string;
  address?: string;
  contact: IContactRequest;
}

export interface IProductRequest {
  name: string;
  sku: string;
  description?: string;
  price: number;
  category: string;
  manufacturer: IManufacturerRequest;
  amountInStock: number;
}

export interface IProductUpdateRequest {
  name?: string;
  sku?: string;
  description?: string;
  price?: number;
  category?: string;
  manufacturer?: Partial<IManufacturerRequest>;
  amountInStock?: number;
}

// Response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  errors?: string[];
}

export interface ValidationError {
  field: string;
  message: string;
}