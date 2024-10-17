require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_API: process.env.CLOUDINARY_API,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};
