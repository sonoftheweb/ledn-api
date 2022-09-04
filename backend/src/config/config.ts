import dotenv from "dotenv";

dotenv.config();

export const config = {
  mongo: {
    url: process.env.DATABASE_URL || "",
    db: process.env.DATABASE_NAME || "",
  },
  app: {
    port: process.env.PORT || 8080,
  },
};
