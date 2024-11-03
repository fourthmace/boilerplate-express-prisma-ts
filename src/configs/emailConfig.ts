import "dotenv/config";

export const emailConfig = {
  host: process.env.EMAIL_HOST || "",
  port: process.env.EMAIL_PORT || "",
  secure: process.env.EMAIL_SECURE == "true" || false,
  user: process.env.EMAIL_USER || "",
  password: process.env.EMAIL_PASS || "",
};