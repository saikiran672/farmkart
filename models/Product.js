const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['vegetables', 'fruits', 'grains', 'dairy', 'herbs', 'other']
  },
  imageUrl: {
    type: String,
    default: ''
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  unit: {
    type: String,
    default: 'kg',
    enum: ['kg', 'g', 'dozen', 'piece', 'litre', 'bundle']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

productSchema.index({ category: 1, createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
