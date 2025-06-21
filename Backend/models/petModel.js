const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      required: true,
    },
    breed: {
      type: String,
      trim: true,
    },
    adoptionStatus: {
      type: String,
      enum: ["available", "adopted", "pending"],
      default: "available",
    },
    tags: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    birthDate: {
      type: Date,
      required: true,
    },
    adoptionDatatime: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);
const Pet = mongoose.model("Pet", petSchema);
module.exports = Pet;
