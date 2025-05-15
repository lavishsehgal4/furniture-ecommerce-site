const mongoose = require("mongoose");

const helpRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
  postcode: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  agreedToTerms: {
    type: Boolean,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const HelpRequest = mongoose.model("HelpRequest", helpRequestSchema);
module.exports = HelpRequest;
