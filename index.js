import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import colors from "colors";
import ConnectDB from "./config/dataBase.js";
import userRoute from "./routes/user_route.js";
import foodCategoryRoute from "./routes/food_category-routes.js";
import foodList from "./routes/food_route.js";
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});
//database
ConnectDB();

app.use("/user", userRoute);
app.use("/food_category", foodCategoryRoute);
app.use("/food", foodList);

app.get("/", (req, res) => {
  res.send(`<h1> Server is running! </h1>`);
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`.cyan.underline.bold);
});
