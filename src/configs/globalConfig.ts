import "dotenv/config";

export const globalConfig = {
  appPort: process.env.NODE_PORT || 4000,
  apiPrefix: process.env.NODE_API_PREFIX || "",
  encryptKey: process.env.NODE_ENCRYPT_KEY || "",
  otpExpired: process.env.NODE_OTP_EXPIRED || "",
  jwtKey: process.env.NODE_JWT_KEY || "",
  jwtExpired: process.env.NODE_JWT_EXPIRED || "",
};