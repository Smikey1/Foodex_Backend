import User from "../model/user.js";
import { upload_image } from "../middleware/cloudinary.js";
import bcrypt from "bcryptjs";

// Register
export const register = async (req, res) => {
  try {
    const { email, fullName, dob, phone, password } = req.body;

    if (!email || !fullName || dob || !phone || !password) {
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

    // Set Default User Profile
    const avatar = `https://ui-avatars.com/api/?background=random&name=${fullName}`;
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = await User.create({
      email,
      fullName,
      dob,
      phone,
      password: hashed,
      avatar,
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

    const isMatched = await bcrypt.compare(password, user.password);
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
    const user = await User.findById(req.user._id);
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

//update profile only
export const updateProfileData = async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user not found!",
    });
  }
  try {
    const { email, fullName, dob, phone } = req.body;
    await User.findByIdAndUpdate(
      req.user.id,
      { email, fullName, dob, phone },
      { new: true, runValidators: true, useFindAndModify: false }
    );
    const userData = await User.findById(req.user.id);
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

//update profile with image
export const updateProfileWithImage = async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user not found!",
    });
  }
  const { email, fullName, dob, phone } = req.body;
  try {
    const formImage = req.files.user_image;
    const imagePath = formImage.tempFilePath;
    if (
      formImage.mimetype == "image/png" ||
      formImage.mimetype == "image/jpg" ||
      formImage.mimetype == "application/octet-stream" ||
      formImage.mimetype == "image/jpeg"
    ) {
      const avatar = await upload_image(imagePath, req.user.id);
      await User.findByIdAndUpdate(
        req.user.id,
        { email, fullName, dob, phone, avatar: avatar },
        { new: true, runValidators: true, useFindAndModify: false }
      );
      const userData = await User.findById(req.user.id);
      res.status(200).json({
        success: true,
        message: "user update Successfully!",
        data: userData,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Profile
export const deleteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
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

// change password of user
export const change_password = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findOne({ _id: req.user.id }).select("+password");
    console.log("User-->", user);
    const validLogin = await bcrypt.compare(oldPassword, user.password);
    if (validLogin) {
      const salt = await bcrypt.genSalt(10);
      // Create new password
      const hashed = await bcrypt.hash(newPassword, salt);
      user.password = hashed;
      await user.save();
      res.status(200).json({
        success: true,
        message: "Password changed successfully!",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Invalid Password",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
  res.end();
};


export const save_product_to_wishlist= async(req, res) => {
    try {
        const product = await productModel.findOne({ _id: req.params.productId })
        const user = await userModel.findOne({ _id: req.user._id}).select("wishlistProduct")
        console.log(user.wishlistProduct)
        if (product) {
          if (user.wishlistProduct.includes(product._id)) {
                user.wishlistProduct.pull(product._id)
                await user.save()

              res.status(200).json({
              success: true,
              message: "product Removed",
        });
            } else {
                user.wishlistProduct.push(product._id)
                await user.save()
                res.status(200).json({
                success: true,
                 message: "product Added",
       });
            }
        } else {
          res.status(500).json({
      success: false,
      message: "Product Not Found",
          });

        }
    } catch (error) {
        console.log(error)
         res.status(500).json({
      success: false,
      message: "Something went wrong",
          });
    }
    res.end()
  }

  export const get_user_wishlist_product = async(req, res) =>{
    console.log(req.params);
    try {

      const data = await userModel.findById(req.user._id).populate('wishlistProduct');
      const favs = await Promise.all(data.wishlistProduct.map(product => product.populate('productCategory')));

      res.status(200).json({
      success: true,
        message: "User productModel Fetched",
      data:favs
          });
    } catch (error) {
        console.log(error)
        res.status(500).json({
      success: false,
      message: "Something went wrong",
          });
    }
    res.end()
}
