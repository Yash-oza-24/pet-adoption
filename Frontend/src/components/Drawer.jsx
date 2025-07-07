import React, { useEffect } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTimes, FaPlus, FaEdit, FaTag, FaCalendarAlt, FaDog, FaCat, FaBirthdayCake, FaImage } from "react-icons/fa";

const validate = (values) => {
  const errors = {};
  if (!values.name) errors.name = "Pet name is required";
  if (!values.type) errors.type = "Type is required";
  if (!values.age) errors.age = "Age is required";
  else if (values.age < 0) errors.age = "Age must be positive";
  if (!values.breed) errors.breed = "Breed is required";
  if (!values.birthDate) errors.birthDate = "Birth date is required";
  if (!values.tags) errors.tags = "Tags are required";
  return errors;
};
const token = localStorage.getItem("Token");
const baseUrl = "https://pet-adoption-hpf2.onrender.com/api";

const Drawer = ({
  setShowDrawer,
  showDrawer,
  getPets,
  editPet,
  setEditPet,
}) => {
  const isEdit = !!editPet;
  const formik = useFormik({
    initialValues: {
      name: editPet?.name || "",
      type: editPet?.type || "",
      age: editPet?.age || "",
      breed: editPet?.breed || "",
      birthDate: editPet?.birthDate ? editPet.birthDate.slice(0, 10) : "",
      adoptionStatus: editPet?.adoptionStatus || "available",
      tags: editPet?.tags ? editPet.tags.join(", ") : "",
      images: [],
      adoptionDatatime: editPet?.adoptionDatatime
        ? editPet.adoptionDatatime.slice(0, 16)
        : "",
    },
    enableReinitialize: true,
    validate,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("type", values.type);
      formData.append("age", values.age);
      formData.append("breed", values.breed);
      formData.append("birthDate", values.birthDate);
      formData.append("adoptionStatus", values.adoptionStatus);
      formData.append("adoptionDatatime", values.adoptionDatatime);

      if (values.tags) {
        values.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
          .forEach((tag) => formData.append("tags[]", tag));
      }

      if (values.images && values.images.length > 0) {
        values.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      try {
        if (isEdit) {
          const response = await axios.put(
            `${baseUrl}/pets/update/${editPet._id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response);
          toast.success(response.data.message || "Pet updated!");
        } else {
          const res = await axios.post(
            `${baseUrl}/pets/add`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          toast.success(res.data.message || "Pet added!");
        }
        resetForm();
        getPets();
        setShowDrawer(false);
        setEditPet && setEditPet(null);
      } catch (error) {
        console.error("Error saving pet:", error);
        toast.error(error.response?.data?.message || "Failed to save pet");
      }
    },
  });

  useEffect(() => {
    if (!showDrawer) {
      formik.resetForm();
      setEditPet && setEditPet(null);
    }
  }, [showDrawer]);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          showDrawer ? "visible" : "invisible pointer-events-none"
        }`}
      >
        <div
          className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300 ${
            showDrawer ? "opacity-50" : "opacity-0"
          }`}
          onClick={() => setShowDrawer(false)}
        ></div>
        <div
          className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl rounded-l-2xl border-l border-blue-100 transform transition-transform duration-300 ${
            showDrawer ? "translate-x-0" : "translate-x-full"
          } animate-fade-in`}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100 rounded-tl-2xl">
            <h3 className="text-xl font-bold text-blue-700 flex items-center gap-2">
              {isEdit ? <FaEdit className="text-blue-400" /> : <FaPlus className="text-blue-400" />} {isEdit ? "Edit Pet" : "Add Pet"}
            </h3>
            <button
              onClick={() => setShowDrawer(false)}
              className="text-gray-400 hover:text-blue-600 text-2xl font-bold transition focus:outline-none"
              aria-label="Close"
            >
              <FaTimes />
            </button>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-64px)]">
            <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-gray-700 mb-1 font-medium" htmlFor="name">
                  Pet Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                    <FaDog />
                  </span>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                      formik.touched.name && formik.errors.name
                        ? "border-red-400"
                        : "border-blue-200"
                    }`}
                    placeholder="Enter pet name"
                  />
                </div>
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-500 text-xs mt-1 font-medium animate-fade-in">
                    {formik.errors.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium" htmlFor="type">
                  Type
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                    <FaCat />
                  </span>
                  <input
                    id="type"
                    name="type"
                    type="text"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                      formik.touched.type && formik.errors.type
                        ? "border-red-400"
                        : "border-blue-200"
                    }`}
                    placeholder="e.g. Dog, Cat"
                  />
                </div>
                {formik.touched.type && formik.errors.type && (
                  <p className="text-red-500 text-xs mt-1 font-medium animate-fade-in">
                    {formik.errors.type}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium" htmlFor="age">
                  Age
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                    <FaBirthdayCake />
                  </span>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    value={formik.values.age}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                      formik.touched.age && formik.errors.age
                        ? "border-red-400"
                        : "border-blue-200"
                    }`}
                    placeholder="Enter pet age"
                  />
                </div>
                {formik.touched.age && formik.errors.age && (
                  <p className="text-red-500 text-xs mt-1 font-medium animate-fade-in">
                    {formik.errors.age}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium" htmlFor="breed">
                  Breed
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                    <FaDog />
                  </span>
                  <input
                    id="breed"
                    name="breed"
                    type="text"
                    value={formik.values.breed}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                      formik.touched.breed && formik.errors.breed
                        ? "border-red-400"
                        : "border-blue-200"
                    }`}
                    placeholder="Enter breed"
                  />
                </div>
                {formik.touched.breed && formik.errors.breed && (
                  <p className="text-red-500 text-xs mt-1 font-medium animate-fade-in">
                    {formik.errors.breed}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium" htmlFor="birthDate">
                  Birth Date
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                    <FaCalendarAlt />
                  </span>
                  <input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formik.values.birthDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                      formik.touched.birthDate && formik.errors.birthDate
                        ? "border-red-400"
                        : "border-blue-200"
                    }`}
                  />
                </div>
                {formik.touched.birthDate && formik.errors.birthDate && (
                  <p className="text-red-500 text-xs mt-1 font-medium animate-fade-in">
                    {formik.errors.birthDate}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium" htmlFor="adoptionStatus">
                  Adoption Status
                </label>
                <select
                  id="adoptionStatus"
                  name="adoptionStatus"
                  value={formik.values.adoptionStatus}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition border-blue-200 bg-white text-gray-700 font-medium"
                >
                  <option value="available">Available</option>
                  <option value="adopted">Adopted</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium" htmlFor="tags">
                  Tags
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                    <FaTag />
                  </span>
                  <input
                    id="tags"
                    name="tags"
                    type="text"
                    value={formik.values.tags}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                      formik.touched.tags && formik.errors.tags
                        ? "border-red-400"
                        : "border-blue-200"
                    }`}
                    placeholder="Comma separated tags (e.g. playful, friendly)"
                  />
                </div>
                {formik.touched.tags && formik.errors.tags && (
                  <p className="text-red-500 text-xs mt-1 font-medium animate-fade-in">
                    {formik.errors.tags}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium" htmlFor="images">
                  Images
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                    <FaImage />
                  </span>
                  <input
                    id="images"
                    name="images"
                    type="file"
                    multiple
                    onChange={(e) => {
                      formik.setFieldValue("images", Array.from(e.target.files));
                    }}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition border-blue-200 bg-white text-gray-700 font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium" htmlFor="adoptionDatatime">
                  Adoption Date & Time
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                    <FaCalendarAlt />
                  </span>
                  <input
                    id="adoptionDatatime"
                    name="adoptionDatatime"
                    type="datetime-local"
                    value={formik.values.adoptionDatatime}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition border-blue-200 bg-white text-gray-700 font-medium"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center gap-2"
              >
                {isEdit ? <FaEdit /> : <FaPlus />} {isEdit ? "Update Pet" : "Add Pet"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Drawer;
