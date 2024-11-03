// prisma
import { User, UserRole } from "@prisma/client";

/**
 * Utils Types
 * --------------------
 */
export interface ResponseFormatType<T> {
  statusCode: number;
  message: string;
  data?: T | null;
}

/**
 * Jwt Types
 * --------------------
 */
export interface jwyPayloadType {
  user_id: string,
  role: string,
  expired: number,
};

export interface UserWithRole extends User {
  user_role: UserRole;
}

/**
 * Email Template Types
 * --------------------
 */
export interface OtpTemplateInputType {
  name: string;
  code: string;
  expired: number;
};