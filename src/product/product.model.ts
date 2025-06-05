import mongoose, { Document, Schema } from "mongoose";

export interface IContact {
  name: string;
  email: string;
  phone: string;
}

export interface IManufacturer {
  name: string;
  country: string;
  website?: string;
  description?: string;
  address?: string;
  contact: IContact;
}

export interface IProduct extends Document {
  name: string;
  sku: string;
  description?: string;
  price: number;
  category: string;
  manufacturer: IManufacturer;
  amountInStock: number;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>({
  name: {
    type: String,
    required: [true, 'Contact name is required']
  },
  email: {
    type: String,
    required: [true, 'Contact email is required'],
    validate: {
      validator: function(v: string): boolean {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  phone: {
    type: String,
    required: [true, 'Contact phone is required']
  }
}, { _id: false });

// Manufacturer subdocument schema
const manufacturerSchema = new Schema<IManufacturer>({
  name: {
    type: String,
    required: [true, 'Manufacturer name is required']
  },
  country: {
    type: String,
    required: [true, 'Manufacturer country is required']
  },
  website: {
    type: String,
    validate: {
      validator: function(v: string): boolean {
        return !v || /^https?:\/\/.+\..+/.test(v);
      },
      message: 'Please enter a valid URL'
    }
  },
  description: {
    type: String
  },
  address: {
    type: String
  },
  contact: {
    type: contactSchema,
    required: [true, 'Manufacturer contact is required']
  }
}, { _id: false });


const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  manufacturer: {
    type: manufacturerSchema,
    required: [true, 'Manufacturer information is required']
  },
  amountInStock: {
    type: Number,
    required: [true, 'Amount in stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  }
}, {
  timestamps: true
});

productSchema.index({ sku: 1 });
productSchema.index({ category: 1 });
productSchema.index({ 'manufacturer.name': 1 });

export default mongoose.model<IProduct>('Product', productSchema);