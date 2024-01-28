import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT || 8001,
  DB_URL: process.env.DB_URL,
  TOKEN_SECRET: process.env.TOKEN_SECRET || "",
};

export default config;
