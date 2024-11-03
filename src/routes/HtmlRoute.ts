// libs
import path from "path"
import { Request, Response, Router } from "express";

/**
 * ROUTE DEFINE
 * ------------------------------------
 */
const router = Router();

router.get("/playground/socket", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../html/playground_socket.html"));
});

export default router;
