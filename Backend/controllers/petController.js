const Pet = require("../models/petModel");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// Use memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function uploadToCloudinary(buffer, filename) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "pets", public_id: filename.split(".")[0] },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

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
    let images = [];
    if (req.files && req.files.length > 0) {
      images = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer, file.originalname))
      );
    }
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
    let images = [];
    if (req.files && req.files.length > 0) {
      images = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer, file.originalname))
      );
    }
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
