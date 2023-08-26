import User from "../model/user.js";
import { upload_image } from "../middleware/cloudinary.js";

// Register
export const register = async (req, res) => {
  try {
    const { email, fullName, dob, phone, password } = req.body;

    if (!email || fullName || dob || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Form are needed to fill!",
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be 8 character!!",
      });
    }
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({
        success: false,
        message: "User already exist!",
      });
    }

    const user = await User.create({
      email,
      fullName,
      dob,
      phone,
      password,
    });

    res.status(200).json({
      success: true,
      message: "Register Successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//login
export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "field must be filled!",
      });
    }

    let user = await User.findOne({ phone }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist!",
      });
    }

    const isMatched = await user.comparePassword(password);
    if (!isMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials!",
      });
    }

    const token = await user.getSignedJwtToken();
    res.status(200).json({
      success: true,
      message: "Login successfully!",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//single profile
export const userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({
        Success: false,
        message: "User does not exist",
      });
    }

    const userData = {
      id: user._id,
      fullName: user.fullName,
      dob: user.dob,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
    };

    res.status(200).json({
      success: true,
      message: "User get success",
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update profile
export const updateProfile = async (req, res) => {
  try {
    const { email, fullName, dob, phone } = req.body;
    const avatar = req.file.filename;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { email, fullName, dob, phone, avatar: avatar },
      { new: true, runValidators: true, useFindAndModify: false }
    );

    const userData = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      dob: user.dob,
      phone: user.phone,
      avatar: user.avatar,
    };

    res.status(200).json({
      success: true,
      message: "user update Successfully!",
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const update_profile_picture = async function (req, res) {
  try {
    const formImage = req.files.profile;
    const imagePath = formImage.tempFilePath;
    if (
      formImage.mimetype == "image/png" ||
      formImage.mimetype == "image/jpg" ||
      formImage.mimetype == "image/jpeg"
    ) {
      const _id = req.user._id;
      const avatar = await upload_image(imagePath, _id);
      await User.updateOne({ _id }, { avatar });
      res.status(200).json({
        success: true,
        message: "Profile Picture Changed",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Must be png, jpg or jpeg",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Must be png, jpg or jpeg",
    });
  }
  res.end();
};
// Delete Profile
export const deleteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not found!",
      });
    }

    await user.remove();
    res.status(200).json({
      success: true,
      message: "User delete successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
