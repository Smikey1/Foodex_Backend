import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    // required: [true, "Please enter your email"],
    nullable: true,
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
  },
  dob: {
    type: String,
    // required: [false, "Please enter your dob"],
    nullable: true,
  },
  phone: {
    type: Number,
    unique: true,
    required: [true, "Please enter your phone number"],
    maxLength: [10, "Number must be only 10 digits"],
  },
  password: {
    type: String,
    required: [true, "Enter the your password"],
    minLength: [8, "Password must be at least 8 characters"],
    select: false,
  },
  avatar: {
    type: String,
  },

  role: {
    type: String,
    default: "User",
  },

  createAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export default mongoose.model("User", userSchema);
