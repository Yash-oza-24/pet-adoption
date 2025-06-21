import axios from "axios";
import React, { useState, useEffect } from "react";
import Drawer from "./Drawer";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPaw } from "react-icons/fa";

const Dashboard = ({ pets, loading, getPets }) => {
  const [error, setError] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);
  const [editPet, setEditPet] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, petId: null, petName: "" });
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString();
  };
  const token = localStorage.getItem("Token");
  const handleDelete = async (petId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/pets/delete/${petId}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getPets();
      toast.success(response.data.message);
    } catch (err) {
      setError("Failed to delete pet");
    }
  };

  const filteredPets = statusFilter
    ? pets.filter((pet) => pet.adoptionStatus === statusFilter)
    : pets;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center flex items-center justify-center gap-2">
          <FaPaw className="text-blue-400 animate-bounce" /> All Pets
        </h2>
        <div className="mb-6 flex justify-center">
          <div className="relative w-64">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full appearance-none px-4 py-2 pr-10 border border-blue-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700 font-medium transition"
              aria-label="Filter pets by status"
            >
              <option value="">All Statuses</option>
              <option value="available">Available</option>
              <option value="adopted">Adopted</option>
              <option value="pending">Pending</option>
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-blue-500 text-lg">
              ▼
            </span>
          </div>
        </div>
        {filteredPets.length === 0 ? (
          <div className="text-center text-gray-500 flex flex-col items-center gap-2">
            <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="No pets" className="w-24 h-24 opacity-60 mx-auto" />
            <span>No pets found.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredPets.map((pet, idx) => (
              <div
                key={pet._id}
                className="bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-2xl shadow-xl p-6 flex flex-col items-center cursor-pointer relative group animate-fade-in border border-blue-100 hover:border-blue-400 hover:shadow-2xl hover:scale-[1.04] transition-all duration-300"
                style={{ animationDelay: `${idx * 60}ms` }}
                onClick={() => setSelectedPet(pet)}
                tabIndex={0}
                aria-label={`View details for ${pet.name}`}
              >
                <div className="relative mb-4">
                  <img
                    src={`http://localhost:3000/${pet?.images?.[0]}`}
                    alt={pet.name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-blue-100 group-hover:border-blue-400 shadow-lg transition-all duration-300 bg-white"
                  />
                  <span className={`absolute bottom-0 right-0 px-2 py-1 rounded-full text-xs font-bold shadow-lg border-2 border-white ${
                    pet?.adoptionStatus === "available"
                      ? "bg-green-400 text-white"
                      : pet?.adoptionStatus === "adopted"
                      ? "bg-gray-400 text-white"
                      : "bg-yellow-400 text-white"
                  }`}>
                    {pet?.adoptionStatus === "available"
                      ? "Available"
                      : pet?.adoptionStatus === "adopted"
                      ? "Adopted"
                      : "Pending"}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-blue-800 mb-1 tracking-tight text-center">
                  {pet.name}
                </h3>
                <p className="text-blue-500 text-sm capitalize font-medium mb-1 text-center">{pet.type}</p>
                <p className="text-gray-400 text-xs mb-2 text-center">
                  Age: <span className="font-semibold text-gray-600">{pet.age} {pet.age === 1 ? "year" : "years"}</span>
                </p>
                {token && (
                  <div className="pt-3 flex gap-2">
                    <button
                      className="bg-gradient-to-r from-green-400 to-green-500 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:from-green-500 hover:to-green-600 flex items-center gap-1 shadow-md transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditPet(pet);
                        setShowDrawer(true);
                      }}
                      aria-label={`Edit ${pet.name}`}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="bg-gradient-to-r from-red-400 to-red-500 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:from-red-500 hover:to-red-600 flex items-center gap-1 shadow-md transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteModal({ open: true, petId: pet._id, petName: pet.name });
                      }}
                      aria-label={`Delete ${pet.name}`}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pet Details Modal */}
      {selectedPet && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedPet(null)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-2xl shadow-2xl max-w-lg w-full p-10 relative border-2 border-blue-200 animate-modal-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-5 text-3xl text-gray-400 hover:text-blue-600 font-bold transition"
              onClick={() => setSelectedPet(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex flex-col items-center">
              {/* Image Carousel */}
              <div className="w-full flex justify-center mb-6">
                {selectedPet.images && selectedPet.images.length > 1 ? (
                  <div className="flex gap-3">
                    {selectedPet.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={`http://localhost:3000/${img}`}
                        alt={selectedPet.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-blue-200 shadow-md hover:scale-105 transition-all duration-200 bg-white"
                      />
                    ))}
                  </div>
                ) : (
                  <img
                    src={`http://localhost:3000/${selectedPet?.images?.[0]}`}
                    alt={selectedPet.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-300 shadow-lg bg-white"
                  />
                )}
              </div>
              <h2 className="text-3xl font-extrabold text-blue-800 mb-2 tracking-tight text-center">
                {selectedPet.name}
              </h2>
              <div className="flex flex-wrap gap-2 mb-4 justify-center">
                {selectedPet.tags &&
                  selectedPet.tags.length > 0 &&
                  selectedPet.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-gradient-to-r from-blue-100 to-blue-300 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow"
                    >
                      #{tag}
                    </span>
                  ))}
              </div>
              <div className="w-full mt-2">
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-gray-700 text-base">
                  <div className="flex items-center gap-2"><span className="font-bold text-blue-600"><FaPaw /></span> <span className="font-semibold">Type:</span> {selectedPet.type}</div>
                  <div className="flex items-center gap-2"><span className="font-bold text-blue-600"><FaPaw /></span> <span className="font-semibold">Breed:</span> {selectedPet.breed || "N/A"}</div>
                  <div className="flex items-center gap-2"><span className="font-bold text-blue-600"><FaPaw /></span> <span className="font-semibold">Age:</span> {selectedPet.age} {selectedPet.age === 1 ? "year" : "years"}</div>
                  <div className="flex items-center gap-2"><span className="font-bold text-blue-600"><FaPaw /></span> <span className="font-semibold">Birth Date:</span> {formatDate(selectedPet.birthDate)}</div>
                  <div className="flex items-center gap-2"><span className="font-bold text-blue-600"><FaPaw /></span> <span className="font-semibold">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ml-1
                        ${
                          selectedPet?.adoptionStatus === "available"
                            ? "bg-green-200 text-green-700"
                            : selectedPet?.adoptionStatus === "adopted"
                            ? "bg-gray-200 text-gray-700"
                            : "bg-yellow-200 text-yellow-700"
                        }
                    `}
                    >
                      {selectedPet?.adoptionStatus === "available"
                        ? "Available"
                        : selectedPet?.adoptionStatus === "adopted"
                        ? "Adopted"
                        : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2"><span className="font-bold text-blue-600"><FaPaw /></span> <span className="font-semibold">Adoption Date:</span> {selectedPet.adoptionDatatime ? formatDate(selectedPet.adoptionDatatime) : "N/A"}</div>
                </div>
              </div>
              <div className="w-full mt-8 flex justify-center">
                <button
                  className={`px-8 py-3 rounded-xl font-bold shadow-lg transition flex items-center gap-2 text-lg tracking-wide
                    ${
                      selectedPet.adoptionStatus === "available"
                        ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  disabled={selectedPet.adoptionStatus !== "available"}
                  aria-label={selectedPet.adoptionStatus === "available" ? "Adopt this pet" : "Not available for adoption"}
                >
                  <FaPaw />
                  {selectedPet.adoptionStatus === "available"
                    ? "Adopt Me"
                    : "Not Available"}
                </button>
              </div>
              <div className="w-full mt-6 text-xs text-gray-400 text-center">
                Created: {formatDate(selectedPet.createdAt)} | Updated: {formatDate(selectedPet.updatedAt)}
              </div>
            </div>
          </div>
        </div>
      )}
      <Drawer
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        getPets={getPets}
        editPet={editPet}
        setEditPet={setEditPet}
      />
      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" aria-modal="true" role="dialog">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-8 relative border border-blue-100 animate-modal-in">
            <button
              className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-blue-600 font-bold"
              onClick={() => setDeleteModal({ open: false, petId: null, petName: "" })}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex flex-col items-center">
              <div className="text-3xl text-red-500 mb-2"><FaTrash /></div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">Delete Pet</h3>
              <p className="text-gray-600 text-center mb-6">Are you sure you want to delete <span className="font-semibold text-red-600">{deleteModal.petName}</span>? This action cannot be undone.</p>
              <div className="flex gap-4 w-full justify-center">
                <button
                  className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                  onClick={() => setDeleteModal({ open: false, petId: null, petName: "" })}
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold shadow hover:from-red-600 hover:to-red-800 transition"
                  onClick={async () => {
                    await handleDelete(deleteModal.petId);
                    setDeleteModal({ open: false, petId: null, petName: "" });
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
