// types
import { UserWithRole } from "./helpersTypes";

declare module "socket.io" {
  interface Socket extends BaseSocket {
    login_info?: UserWithRole;
  }
}
