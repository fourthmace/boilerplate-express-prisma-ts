import { globalConfig } from "./configs"
import { setupSocket } from "./pkg/socket"

/**
 * Load Libs
 * --------------------------------------
 */
import http from "http"
import cors from "cors"
import express, { Response } from "express"

/**
 * Import Routes
 * --------------------------------------
 */
import HtmlRoute from "./routes/HtmlRoute";
import AuthRoute from "./routes/AuthRoute"

/**
 * Express Setup
 * --------------------------------------
 */
const app = express();
const port = globalConfig.appPort;
const apiPrefix = globalConfig.apiPrefix;

/* expires's middlewares setup */
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* expires's routing */
app.get("/", (_, res: Response) => {
  res.status(200).json({ message: "FOURTHMACE IS HERE" });
});
app.use(HtmlRoute);
app.use(apiPrefix, AuthRoute);

/* start HTTO server */
const server = http.createServer(app);

/* init socket.io */
setupSocket(server)

server.listen(port, () => {
  console.log(`App listening at port:${port}`);
});