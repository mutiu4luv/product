const express = require("express");
const {
  registerUser,
  getUsers,
  loginUser,
  deleteUser,
  updateUser,
  getUserById,
} = require("../controller/userController");

const router = express.Router();

router.post("/register", registerUser);
router.get("/login", getUsers);
router.post("/login", loginUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);
router.get("/:id", getUserById);
module.exports = router;
