import fs from "fs";
import https from "https";

import dotenv from "dotenv";
import express from "express";

import loadRoutes from "./routes";

const result = dotenv.config();
if (result.error) {
  throw result.error;
}
const {
  env: {
    PORT: port = "8000",
    SECURED_SERVER,
  },
} = process;
const app: express.Application = express();

const onBoot = () => {
  // eslint-disable-next-line no-console
  console.log(`server started at http://localhost:${port}`);
  loadRoutes(app);
};

const startServer = () => {
  if (SECURED_SERVER === "YES") {
    const privateKey = fs.readFileSync("privatekey.pem");
    const certificate = fs.readFileSync("certificate.pem");
    https
      .createServer(
        {
          cert: certificate,
          key: privateKey,
        },
        app,
      )
      .listen(port);
  } else {
    app.listen(port, onBoot);
  }
};

startServer();

export default app;
