const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const dbUrl = process.env.DB_URL;

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(dbUrl);
    if (connection) console.log("DB connected");
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

module.exports = connectDB;
