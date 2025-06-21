import axios from "axios";
const API_URL = "http://localhost:3000/api";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAllPets = async () => {
  try {
    const response = await axios.get(`${API_URL}/pets/all`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const addPet = async (petData) => {
  try {
    const response = await axios.post(`${API_URL}/pets/add`, petData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updatePet = async (petId, petData) => {
  try {
    const response = await axios.put(
      `${API_URL}/pets/update/${petId}`,
      petData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deletePet = async (petId) => {
  try {
    const response = await axios.delete(`${API_URL}/pets/delete/${petId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

