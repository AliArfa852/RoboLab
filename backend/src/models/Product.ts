import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  currency: string;
  description: string;
  specifications: Record<string, any>;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  supplier: string;
  tags: string[];
  rating: number;
  reviews: IReview[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IReview {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ProductSchema = new Schema<IProduct>({
  name: { 
    type: String, 
    required: true, 
    trim: true,
    index: true 
  },
  category: { 
    type: String, 
    required: true,
    index: true 
  },
  subcategory: { 
    type: String,
    index: true 
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  currency: { 
    type: String, 
    required: true, 
    default: 'PKR' 
  },
  description: { 
    type: String, 
    required: true 
  },
  specifications: { 
    type: Schema.Types.Mixed, 
    default: {} 
  },
  images: [{ 
    type: String 
  }],
  inStock: { 
    type: Boolean, 
    default: true 
  },
  stockQuantity: { 
    type: Number, 
    default: 0 
  },
  supplier: { 
    type: String, 
    required: true 
  },
  tags: [{ 
    type: String,
    index: true 
  }],
  rating: { 
    type: Number, 
    default: 0, 
    min: 0, 
    max: 5 
  },
  reviews: [ReviewSchema],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Indexes for better query performance
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ category: 1, subcategory: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ rating: -1 });
ProductSchema.index({ inStock: 1 });
ProductSchema.index({ createdAt: -1 });

// Update the updatedAt field before saving
ProductSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Calculate average rating from reviews
ProductSchema.methods.calculateRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    return;
  }
  
  const totalRating = this.reviews.reduce((sum: number, review: IReview) => sum + review.rating, 0);
  this.rating = totalRating / this.reviews.length;
};

// Add review to product
ProductSchema.methods.addReview = function(userId: string, userName: string, rating: number, comment: string) {
  const review: IReview = {
    userId,
    userName,
    rating,
    comment,
    createdAt: new Date()
  };
  
  this.reviews.push(review);
  this.calculateRating();
  return this.save();
};

// Static method to search products
ProductSchema.statics.searchProducts = function(query: string, filters: any = {}) {
  const searchQuery: any = {};
  
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  if (filters.category) {
    searchQuery.category = filters.category;
  }
  
  if (filters.subcategory) {
    searchQuery.subcategory = filters.subcategory;
  }
  
  if (filters.minPrice !== undefined) {
    searchQuery.price = { ...searchQuery.price, $gte: filters.minPrice };
  }
  
  if (filters.maxPrice !== undefined) {
    searchQuery.price = { ...searchQuery.price, $lte: filters.maxPrice };
  }
  
  if (filters.inStock !== undefined) {
    searchQuery.inStock = filters.inStock;
  }
  
  if (filters.minRating !== undefined) {
    searchQuery.rating = { $gte: filters.minRating };
  }
  
  if (filters.tags && filters.tags.length > 0) {
    searchQuery.tags = { $in: filters.tags };
  }
  
  return this.find(searchQuery);
};

// Static method to get product categories
ProductSchema.statics.getCategories = function() {
  return this.distinct('category');
};

// Static method to get subcategories for a category
ProductSchema.statics.getSubcategories = function(category: string) {
  return this.distinct('subcategory', { category });
};

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
