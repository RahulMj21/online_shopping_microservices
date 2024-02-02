import dotenv from "dotenv";

if (process.env.NODE_ENV !== "prod") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotenv.config({ path: configFile });
} else {
  dotenv.config();
}

const config = {
  PORT: process.env.PORT || 8000,
  DB_URL: process.env.DB_URL,
  TOKEN_SECRET: process.env.TOKEN_SECRET || "",
};

export default config;
