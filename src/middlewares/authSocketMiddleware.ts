// prisma
import prisma from "../pkg/prisma";
// libs
import { Socket } from "socket.io";
// helpers
import { verifyJWTToken } from "../helpers/jwt";

/**
 * Middleware for checking authorization and user roles
 */
export const authSocketMiddleware = async (socket: Socket, next: (err?: Error) => void) => {
  try {
    // Check for Authorization header
    const token = socket.handshake.auth.token;
    
    if (!token) {
      const err = new Error("unauthorized");
      err.message = "invalid token";
      socket.disconnect(true);
      return next(err);
    } else {
      // Decode JWT token
      try {
        const decoded = verifyJWTToken(token);
  
        // Check expired
        if (decoded.expired < Math.floor(Date.now() / 1000)) {
          const err = new Error("token expired");
          err.message = "please generate your token";
          socket.disconnect(true);
          return next(err);
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
            const err = new Error("unauthorized");
            err.message = "invalid token";
            socket.disconnect(true);
            return next(err);
          } else {
            // Attach user to request object
            socket.login_info = user;
      
            // Proceed to the next middleware or route handler
            next();
          }
        }
      } catch (error: any) {
        const err = new Error("unauthorized");
        err.message = "invalid token";
        socket.disconnect(true);
        return next(err);
      }
    }
  } catch (error: any) {
    const err = new Error("server error");
    err.message = error.message;
    socket.disconnect(true);
    next(err);
  }
};
