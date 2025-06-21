import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Drawer from "./Drawer";
import Dashboard from "./Dashboard";
import axios from "axios";
import { FaPaw, FaPlus, FaSignOutAlt, FaSignInAlt, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("Token");
  const userInfo = localStorage.getItem("userInfo");

  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("userInfo");
  };
  
   const getPets = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/pets/all");
      setPets(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPets();
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-blue-100 shadow-lg animate-fade-in">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <FaPaw className="text-blue-500 text-2xl animate-bounce" />
              <span className="text-2xl font-extrabold text-blue-700 tracking-tight select-none">
                Pet Adoption
              </span>
            </div>
            <div className="hidden md:flex md:items-center space-x-6">
              {token && userInfo && (
                <button
                  onClick={() => setShowDrawer(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Add Pet"
                >
                  <FaPlus />
                </button>
              )}
              {token && userInfo ? (
                <Link
                  to="/login"
                  className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-200 flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt /> Logout
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-200 flex items-center gap-2"
                >
                  <FaSignInAlt /> Login
                </Link>
              )}
            </div>
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-blue-700 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                aria-label="Toggle menu"
              >
                {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden bg-white border-t border-blue-100 animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#"
                className="block px-3 py-2 rounded text-blue-700 font-semibold hover:bg-blue-50 hover:text-blue-900 transition"
              >
                Home
              </a>
              {token && userInfo && (
                <button
                  onClick={() => setShowDrawer(true)}
                  className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 justify-center"
                >
                  <FaPlus /> Add Pet
                </button>
              )}
              {token && userInfo ? (
                <button
                  onClick={handleLogout}
                  className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 justify-center"
                >
                  <FaSignOutAlt /> Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 justify-center"
                >
                  <FaSignInAlt /> Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
      <div className="pt-20">
        <Drawer setShowDrawer={setShowDrawer} showDrawer={showDrawer} getPets={getPets} />
        <Dashboard pets={pets} loading={loading} getPets={getPets} />
      </div>
    </>
  );
};

export default Navbar;
