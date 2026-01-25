import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../Models/Admin.js";

// ADMIN REGISTER
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      name,
      email,
      password: hashedPassword
    });

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ADMIN LOGIN
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const admin = await Admin.findOne({ email, isActive: true });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1" }
    );

    return res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
