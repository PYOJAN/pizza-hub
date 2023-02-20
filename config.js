import { join } from "path";
import { config } from "dotenv";
config({ path: join(__dirname, "app", "config", ".env") });

const env = {
  PORT: process.env.PORT,
  SESSION_SECRET: process.env.SESSION_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,

  OTP_SECRET: process.env.OTP_SECRET,

  MONGO_URI: process.env.MONGO_URI,

  EMAIL: process.env.EMAIL,
  MAIL_SECRETE: process.env.MAIL_SECRETE,
};

export default env;
