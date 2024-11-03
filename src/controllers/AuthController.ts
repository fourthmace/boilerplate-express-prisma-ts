// libs
import { Request, Response } from "express";
// helpers
import { formatResponse } from "../helpers/utils";
// types
import {
  LoginRequestType,
  OtpGenerateRequestType,
  OtpVerifyRequestType,
  RegisterRequestType,
} from "../types/controllersTypes";
// service
import AuthService from "../services/authService";

class AuthController {
  /**
   * Login
   * --------------------------
   */
  static async login(req: Request, res: Response) {
    try {
      // request body
      let reqBody = req.body as LoginRequestType;

      // service
      const result = await AuthService.login(reqBody);

      // response api
      formatResponse(res, {
        statusCode: result.statusCode,
        message: result.message,
        data: result.data,
      });
    } catch (error: any) {
      formatResponse(res, {
        statusCode: 500,
        message: error.message,
      });
    }
  }

  /**
   * Register
   * --------------------------
   */
  static async register(req: Request, res: Response) {
    try {
      // request body
      let reqBody = req.body as RegisterRequestType;

      // service
      const result = await AuthService.register(reqBody);

      // response api
      formatResponse(res, {
        statusCode: 201,
        message: result.message,
        data: result.data,
      });
    } catch (error: any) {
      formatResponse(res, {
        statusCode: 500,
        message: error.message,
      });
    }
  }

  /**
   * Generate OTP
   * --------------------------
   */
  static async otpGenerate(req: Request, res: Response) {
    try {
      // request body
      let reqBody = req.body as OtpGenerateRequestType;

      // service
      const result = await AuthService.otpGenerate(reqBody);

      // response api
      formatResponse(res, {
        statusCode: result.statusCode,
        message: result.message,
        data: result.data,
      });
    } catch (error: any) {
      formatResponse(res, {
        statusCode: 500,
        message: error.message,
      });
    }
  }

  /**
   * Verify OTP
   * --------------------------
   */
  static async otpVerify(req: Request, res: Response) {
    try {
      // request body
      let reqBody = req.body as OtpVerifyRequestType;

      // service
      const result = await AuthService.otpVerify(reqBody);

      // response api
      formatResponse(res, {
        statusCode: result.statusCode,
        message: result.message,
        data: result.data,
      });
    } catch (error: any) {
      formatResponse(res, {
        statusCode: 500,
        message: error.message,
      });
    }
  }
}

export default AuthController;
