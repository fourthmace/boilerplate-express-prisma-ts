// libs
import { Router } from "express";
// controller
import AuthController from "../controllers/AuthController";
// helpers
import { validationMapper } from "../helpers/utils";
// validators
import { loginRules, otpGenerateRules, otpVerifyRules, registerRules } from "../validators/AuthRules";

/**
 * ROUTE DEFINE
 * ------------------------------------
 */
const router = Router();

router.post(
  "/auth/login",
  loginRules(),
  validationMapper,
  AuthController.login
);
router.post(
  "/auth/register",
  registerRules(),
  validationMapper,
  AuthController.register
);
router.post(
  "/auth/otp_generate",
  otpGenerateRules(),
  validationMapper,
  AuthController.otpGenerate
);
router.post(
  "/auth/otp_verify",
  otpVerifyRules(),
  validationMapper,
  AuthController.otpVerify
);

export default router;
