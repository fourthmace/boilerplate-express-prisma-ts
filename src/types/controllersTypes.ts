/**
 * Auth Controller Types
 * --------------------
 */

export enum OtpMethod {
  email = "email",
  phone_number = "phone_number",
}

export interface LoginRequestType {
  otp_method: OtpMethod;
  email?: string;
  phone_number?: string;
  password: string;
}

export interface RegisterRequestType {
  otp_method: OtpMethod;
  email?: string;
  phone_number?: string;
  first_name: string;
  last_name: string;
  password: string;
}

export interface OtpGenerateRequestType {
  otp_method: OtpMethod;
  value: string;
}

export interface OtpVerifyRequestType {
  otp_method: OtpMethod;
  value: string;
  otp_code: string;
}
