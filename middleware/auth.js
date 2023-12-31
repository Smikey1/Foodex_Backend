import User from "../model/user.js";
import jwt from "jsonwebtoken";

export const authenticated = async (req, res, next) => {
  try {
    let token = "";
    token = token ? token : req?.headers?.authorization;
    token = token?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first!",
      });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (req.user === null) {
      return res.status(401).json({
        success: false,
        message: "session expired!",
      });
    }
    next();
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//for admin role
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        success: false,
        message: ` ${req.user.role} is not allowed to access this resource`,
      });
    }
    next();
  };
};