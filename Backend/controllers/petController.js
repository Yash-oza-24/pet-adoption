const Pet = require("../models/petModel");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const createPet = async (req, res) => {
  try {
    const {
      name,
      age,
      type,
      breed,
      adoptionStatus,
      tags,
      birthDate,
      adoptionDatatime,
    } = req.body;
    const images = req.files ? req.files.map((file) => file.path) : [];
    const newPet = new Pet({
      name,
      age,
      type,
      breed,
      adoptionStatus,
      tags,
      birthDate: new Date(birthDate),
      adoptionDatatime: adoptionDatatime ? new Date(adoptionDatatime) : null,
      images,
    });
    await newPet.save();
    res.status(201).json({ message: "Pet created successfully", pet: newPet });
  } catch (error) {
    console.error("Error creating pet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPets = async (req, res) => {
  try {
    const pets = await Pet.find();
    res.status(200).json(pets);
  } catch (error) {
    console.error("Error fetching pets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPetById = async (req, res) => {
  try {
    const petId = req.params.id;
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    res.status(200).json(pet);
  } catch (error) {
    console.error("Error fetching pet by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatePet = async (req, res) => {
  try {
    const petId = req.params.id;
    const {
      name,
      age,
      type,
      breed,
      adoptionStatus,
      tags,
      birthDate,
      adoptionDatatime,
    } = req.body;
    const images = req.files ? req.files.map((file) => file.path) : [];

    // Build updatedData object
    const updatedData = {
      name,
      age,
      type,
      breed,
      adoptionStatus,
      tags,
      birthDate: new Date(birthDate),
      adoptionDatatime: adoptionDatatime ? new Date(adoptionDatatime) : null,
    };

    if (images.length > 0) {
      updatedData.images = images;
    }

    const updatedPet = await Pet.findByIdAndUpdate(petId, updatedData, {
      new: true,
    });

    if (!updatedPet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    res
      .status(200)
      .json({ message: "Pet updated successfully", pet: updatedPet });
  } catch (error) {
    console.error("Error updating pet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deletePet = async (req, res) => {
  try {
    const petId = req.params.id;
    const deletedPet = await Pet.findByIdAndDelete(petId);
    if (!deletedPet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (error) {
    console.error("Error deleting pet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createPet,
  getPets,
  getPetById,
  updatePet,
  deletePet,
  upload,
};
