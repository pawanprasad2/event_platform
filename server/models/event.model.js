const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    dateTime: { type: Date, required: true, index: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1 },
    attendeesCount: { type: Number, default: 0, min: 0 },
    imageUrl: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);