// models/Cart.js
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  product: {
    id: String,
    category: String,
    image: String,
    name: String,
    price: String,
    description: String,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Cart", cartSchema);
