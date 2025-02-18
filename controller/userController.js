const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
//  REGISTER USER

const registerUser = async (req, res) => {
  try {
    const { userName, email, password, phoneNumber, name, sex, maritalStatus } =
      req.body;

    // Validate required fields
    if (!userName || !email || !password || !name || !sex || !maritalStatus) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user in the database
    const newUser = new User({
      userName, // Corrected field
      email,
      password: hashedPassword,
      phoneNumber,
      name,
      sex,
      maritalStatus,
    });

    const registeredUser = await newUser.save();
    const token = jwt.sign({ id: newUser._id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      token,
      newUser: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        name: newUser.name,
        sex: newUser.sex,
        maritalStatus: newUser.maritalStatus,
      },
    });
    // res.status(201).json(registeredUser);
  } catch (error) {
    console.error("Registration Error:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate value",
        field: Object.keys(error.keyValue),
      });
    }

    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN USER

const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Find the user by userName
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// DELETE USER BY ID
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

// UPDATE USER BY ID
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    const updatedData = req.body;

    // Only hash password if it's being updated
    if (updatedData.password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(updatedData.password, salt);
    }

    // Update user in the database
    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Enforce validation rules
    });

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};
// GET USER BY ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error retrieving user:", error);

    // Handle invalid ObjectId error
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    res
      .status(500)
      .json({ message: "Error retrieving user", error: error.message });
  }
};

module.exports = {
  registerUser,
  getUsers,
  loginUser,
  deleteUser,
  updateUser,
  getUserById,
};
