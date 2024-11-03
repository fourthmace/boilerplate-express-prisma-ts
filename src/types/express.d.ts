// types
import { UserWithRole } from "./helpersTypes";

declare module "express-serve-static-core" {
  interface Request {
    login_info?: User; // sesuaikan tipe User jika diperlukan
  }
}
