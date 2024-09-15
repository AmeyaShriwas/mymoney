const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const User = require("../Models/UserModel");
const jwt = require('jsonwebtoken');
const Transporter = require('./../config')

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};



const sendOtpEmail = async(email, otp)=> {
  const mailOption = {
     from : process.env.EMAIL_USER,
     to: email,
     subject :'Your One Time Password (otp) Code',
     text :`Dear User,\n\nThank you for choosing Expense Tracker App. Your One-Time-Password(OTP) code for account verification is: ${otp}\n\nThis OTP is valid for the next 10 minutes. Please use it to complete the verification process.\n\nIf you didn't request this OTP, please ignore this email.\n\nBest regards,\nThe Expense Tracker Team`
  }
  await Transporter.sendMail(mailOption)
}

// Find user by email
const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const createUser = async (email, password, number) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const newUser = new User({ email, password: hashedPassword, number, otp });
    await newUser.save();
    await sendOtpEmail(email, otp);
    
    return { success: true, message: "User registered, OTP sent to email", newUser };
  } catch (error) {
    throw new Error("Failed to create user: " + error.message);
  }
};


// Verify user OTP
const verifyUserOtp = async (email, otp) => {
  const user = await User.findOne({ email });
  if (user && user.otp === otp) {
    user.isVerified = true;
    await user.save();
    return true;
  }
  return false;
};

// Log in user
const loginUser = async (email, password, secret, expiresIn) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { error: "Invalid login credentials" };
    }
    if (!user.isVerified) {
      throw new Error('User is not verified');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: "Invalid login credentials" };
    }

    const token = jwt.sign({ _id: user._id.toString() }, secret, { expiresIn: '7d' });
    return {message: 'login successful', token };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Update OTP for user
const updateOtpForUser = async (user, otp) => {
  user.otp = otp;
  await user.save();
  await sendOtpEmail(user.email, otp);
};

// Update user password
const updateUserPassword = async (user, newPassword) => {
  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = "";
  await user.save();
};

module.exports = {
  generateOTP,
  sendOtpEmail,
  findUserByEmail,
  createUser,
  verifyUserOtp,
  loginUser,
  updateOtpForUser,
  updateUserPassword,
};
