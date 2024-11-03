// libs
import { body } from "express-validator";
// prisma
import prisma from "../pkg/prisma";

/**
 * Login Rules
 * ---------------------
 */
export const loginRules = () => {
  return [
    body("otp_method")
      .notEmpty()
      .withMessage("otp_method is required")
      .isIn(["email", "phone_number"])
      .withMessage("otp_method allowed values: 'email', 'phone_number'"),
    body("email").custom((value, { req }) => {
      if (req.body.otp_method === "email") {
        if (!value) {
          throw new Error("email is required");
        }
      }
      return true; // If validation passes
    }),
    body("phone_number").custom((value, { req }) => {
      if (req.body.otp_method === "phone_number") {
        if (!value) {
          throw new Error("phone_number is required");
        }
      }
      return true; // If validation passes
    }),
    body("password").notEmpty().withMessage("password is required"),
  ];
};

/**
 * Register Rules
 * ---------------------
 */
export const registerRules = () => {
  return [
    body("otp_method")
      .notEmpty()
      .withMessage("otp_method is required")
      .isIn(["email", "phone_number"])
      .withMessage("otp_method allowed values: 'email', 'phone_number'"),
    body("email").custom(async (value, { req }) => {
      if (req.body.otp_method === "email") {
        if (!value) { // required
          throw new Error("email is required");
        }
        else if (!/\S+@\S+\.\S+/.test(value)) { // email format
          throw new Error("invalid email format");
        } else { // is exist
          const user = await prisma.user.findFirst({
            where: {
              email: value,
            },
          });

          if (user) {
            throw new Error("email is used");
          }
        }
      }
      return true; // If validation passes
    }), 
    body("phone_number").custom(async (value, { req }) => {
      if (req.body.otp_method === "phone_number") {
        if (!value) { // required
          throw new Error("phone_number is required");
        }
        if (!/^\+?[1-9]\d{1,14}$/.test(value)) { // phone_number format
          throw new Error("invalid phone_number format");
        } else { // is exist
          const user = await prisma.user.findFirst({
            where: {
              phone_number: value,
            },
          });

          if (user) {
            throw new Error("phone_number is used");
          }
        }
      }
      return true; // If validation passes
    }),
    body("first_name").notEmpty().withMessage("first_name is required"),
    body("last_name").notEmpty().withMessage("last_name is required"),
    body("password").notEmpty().withMessage("password is required"),
  ];
};

/**
 * Otp Generate
 * ---------------------
 */
export const otpGenerateRules = () => {
  return [
    body("otp_method")
      .notEmpty()
      .withMessage("otp_method is required")
      .isIn(["email", "phone_number"])
      .withMessage("otp_method allowed values: 'email', 'phone_number'"),
    body("value").notEmpty().withMessage("value is required"),
  ];
};

/**
 * Otp Verify
 * ---------------------
 */
export const otpVerifyRules = () => {
  return [
    body("otp_method")
      .notEmpty()
      .withMessage("otp_method is required")
      .isIn(["email", "phone_number"])
      .withMessage("otp_method allowed values: 'email', 'phone_number'"),
    body("value").notEmpty().withMessage("value is required"),
    body("otp_code").notEmpty().withMessage("otp_code is required"),
  ];
};
