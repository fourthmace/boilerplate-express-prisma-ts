// libs
import { v4 as uuidv4 } from "uuid"
import { NextFunction, Request, Response } from "express";
import { validationResult } from 'express-validator'; // Import validationResult from express-validator
// types
import { ResponseFormatType } from "../types/helpersTypes";

/**
 * Generate UUID
 * 
 * Use UUID v4.
 */
export const generateUUID = () => {
  return uuidv4();
}

/**
 * Response Formatin
 * 
 * Formats and sends a JSON response to the client.
 */
export const formatResponse = <T>(
  res: Response,
  responseFormat: ResponseFormatType<T>
): void => {
  const { statusCode, message, data } = responseFormat;
  res.status(statusCode).json({
    message,
    data,
  });
};

/**
 * Generate Otp
 * 
 * make otp code with custom length.
 */
export const generateOTP = (length: number = 6): string => {
  const characters = "0123456789";
  let otp = "";

  // Generate OTP by randomly selecting characters from the allowed set.
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters[randomIndex];
  }

  return otp;
}

/**
 * Validation Mapper
 * 
 * make errors into a structured response and sends it back to the client.
 */
export const validationMapper = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  // Extract errors and format them
  const extractedErrors = errors.array().reduce<Record<string, string[]>>((acc, err: any) => {
    if (!acc[err.path]) {
      acc[err.path] = [];
    }
    acc[err.path].push(err.msg);
    return acc;
  }, {});

  // Return formatted response with errors
  return formatResponse(res, {statusCode:400, message: "invalid request", data: extractedErrors});
};

/**
 * Formating Whatsapp Number
 * 
 * make sure the number sendable with whatsapp rule.
 */
export const phoneNumberFormatter = function (number: string) {
  let formatted = number.replace(/\D/g, "");

  if (formatted.startsWith("0")) {
    formatted = "62" + formatted.substr(1);
  }
  if (!formatted.endsWith("@c.us")) {
    formatted += "@c.us";
  }

  return formatted;
};
