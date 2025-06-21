const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const existingUser = await User.find({ email });
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const bcryptPassowrd = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: bcryptPassowrd,
      role,
    });

    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      newUser,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });

    if (user === null) {
      console.log("User not found");
      return res.status(401).json({ message: "User not found" });
    }

    if (user.email === email && !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  loginUser,
  registerUser,
};
