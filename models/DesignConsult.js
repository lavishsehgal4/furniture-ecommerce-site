const mongoose = require("mongoose");

const designConsultSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  bookedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DesignConsult", designConsultSchema);
