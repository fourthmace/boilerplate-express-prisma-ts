// config
import { globalConfig } from "../configs";
// libs
import jsonwebtoken from "jsonwebtoken";
// types
import { jwyPayloadType } from "../types/helpersTypes";

const KEY = globalConfig.jwtKey;

/**
 * Generate JWT Token
 */
export const generateJWTToken = (payload: jwyPayloadType): string => {
  try {
    const token = jsonwebtoken.sign(payload, KEY);
    return token;
  } catch (error: any) {
    console.log("error - generateJWTToken - jwt.ts: ", error.message);
    throw new Error("generate token failed");
  }
};

/**
 * Verify JWT Token
 */
export const verifyJWTToken = (token: string): jwyPayloadType => {
  try {
    const decode = jsonwebtoken.verify(token, KEY);
    return decode as jwyPayloadType;
  } catch (error: any) {
    console.log("error - verifyJWTToken - jwt.ts: ", error.message);
    throw new Error("unauthorized");
  }
};
