// libs
import { NextFunction, Request, Response } from "express";
// prisma
import { UserRoleEnum } from "@prisma/client";
import prisma from "../pkg/prisma";
// helpers
import { formatResponse } from "../helpers/utils";
import { verifyJWTToken } from "../helpers/jwt";

/**
 * Middleware for checking authorization and user roles
 */
export const authMiddleware = (allowedRoles: UserRoleEnum[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check for Authorization header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return formatResponse(res, {
          statusCode: 401,
          message: "unauthorized",
        });
      } else {
        // Extract token from header
        const token = authHeader.split(" ")[1];

        // Decode JWT token
        try {
          const decoded = verifyJWTToken(token);
          
          // Check expired
          if (decoded.expired < Math.floor(Date.now() / 1000)) {
            formatResponse(res, {
              statusCode: 401,
              message: "token expired",
            });
          } else {
            // Find user by user_id from the decoded JWT
            const user = await prisma.user.findFirst({
              where: {
                user_id: decoded.user_id,
              },
              include: {
                user_role: true,
              },
            });

            if (!user) {
              formatResponse(res, {
                statusCode: 401,
                message: "unauthorized",
              });
            } else {
              // Check if user's role is in the allowedRoles array
              if (!allowedRoles.includes(user.user_role.name)) {
                formatResponse(res, {
                  statusCode: 401,
                  message: "unauthorized",
                });
              } else {
                // Attach user to request object
                req.login_info = user;
    
                // Proceed to the next middleware or route handler
                next();
              }
            }
          }
        } catch (error: any) {
          console.log("error - authMiddleware - authMiddleware.ts: ", error.message);
          formatResponse(res, {
            statusCode: 500,
            message: "server error",
          });
        }
      }
    } catch (error: any) {
      console.log("error - authMiddleware - authMiddleware.ts: ", error.message);
      formatResponse(res, {
        statusCode: 500,
        message: "server error",
      });
    }
  };
};
