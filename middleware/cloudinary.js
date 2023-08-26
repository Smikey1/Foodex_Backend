import { v2 as cloudinary } from "cloudinary";
const cloud_name = process.env.CLOUD_NAME;
const api_secret = process.env.CLOUD_SECRET_KEY;
const api_key = process.env.CLOUD_API_KEY;

cloudinary.config({ cloud_name, api_secret, api_key });

export const upload_image = async (imagePath, userId) => {
  const profile = await cloudinary.uploader.upload(imagePath, {
    public_id: userId + Date.now(),
    folder: "Foodex",
  });
  return profile.secure_url;
};