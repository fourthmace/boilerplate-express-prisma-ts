// prisma
import prisma from "./prisma";
// libs
import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
// middleware
import { authSocketMiddleware } from "../middlewares/authSocketMiddleware";

let io: Server;

// INIT
export const setupSocket = (server: HttpServer) => {
  try {
    io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
      },
      pingTimeout: 10000,
      pingInterval: 5000,
    });

    // middleware
    io.use(authSocketMiddleware);

    // connection
    io.on("connection", (socket: Socket) => {
      console.log("info - setupSocket - socket.ts: client connected");
      handleSocketConnection(socket);

      // on disconnect
      socket.on("disconnect", () => {
        console.log("info - setupSocket - socket.ts: client disconnected");
      });
    });
  } catch (error: any) {
    console.log("error - setupSocket - socket.ts:", error.message);
  }
};

export const handleSocketConnection = async (socket: Socket) => {
  let loginInfo = socket.login_info;
  let roleName = loginInfo?.user_role.name;

  if (roleName == "user") {
    socket.join(`room:${loginInfo?.user_id}`);
  } else if (roleName == "admin") {
    let users = await prisma.user.findMany({
      where: {
        is_verify: true,
        deleted: false,
      },
    });

    users.forEach((row) => {
      console.log(`joining room:${row.user_id}`);
      socket.join(`room:${row.user_id}`);
    });
    // let currentRoom = null;
    // socket.on("join-room", async (selectedUserId) => {
    //   if (currentRoom) {
    //     await socket.leave(currentRoom);
    //     console.log(`Socket left room: ${currentRoom}`);
    //   }
    //   currentRoom = `room:${selectedUserId}`;
    //   await socket.join(currentRoom);
    //   console.log(`Socket join room: ${currentRoom}`);
    // });
  }
};

// GET IO
export const getSocket = (): Server => io;
