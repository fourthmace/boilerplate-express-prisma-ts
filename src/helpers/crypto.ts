// libs
import { AES, enc } from "crypto-ts";
// config
import { globalConfig } from "../configs";

/**
 * Encrypt Text
 * 
 * Encrypts a plaintext string using AES encryption and returns the hash
 */
export const encrypt = (plainText: string): string => {
  try {
    const hash = AES.encrypt(
      plainText,
      globalConfig.encryptKey
    ).toString();
    return hash;
  } catch (error) {
    console.error("error - encrypt - crypto.ts:", error);
    throw new Error("encryption error");
  }
};

/**
 * Decrypts Text
 * 
 * Decrypts a hashed string using AES decryption and returns the plaintext
 */
export const decrypt = (hashText: string): string => {
  try {
    const bytes = AES.decrypt(hashText, globalConfig.encryptKey);
    const decryptedText = bytes.toString(enc.Utf8);
    return decryptedText ? decryptedText : "";
  } catch (error) {
    console.error("error - decrypt - crypto.ts:", error);
    throw new Error("decryption error");
  }
};

/**
 * Compares Text
 * 
 * Compares a plaintext string with a hashed string to check for equality
 */
export const compare = (plainText: string, hashText: string): boolean => {
  try {
    const bytes = AES.decrypt(hashText, globalConfig.encryptKey);
    const decryptedText = bytes.toString(enc.Utf8);
    return plainText === decryptedText;
  } catch (error) {
    console.error("error - compare - crypto.ts:", error);
    throw new Error("comparison error");
  }
};

