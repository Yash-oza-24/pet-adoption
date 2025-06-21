import React from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navbar />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
};

export default App;
