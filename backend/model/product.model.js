const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'User is required.'],
      ref: 'User',
    },

    name: {
      type: String,
      required: [true, 'Product name is required.'],
    },

    sku: {
      type: String,
      required: [true, 'Product Sku is required.'],
      default: 'sku',
    },

    category: {
      type: String,
      required: [true, 'Category is required.'],
    },

    quantity: {
      type: Number,
      required: [true, 'Quantity is required.'],
    },

    price: {
      type: Number,
      required: [true, 'Price is required.'],
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },

    image: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
