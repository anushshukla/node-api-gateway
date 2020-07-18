import fs from "fs";
import https from "https";

import express from "express";

import onBoot from "./onBoot";

const {
    env: {
      PORT: port = "8000",
      SECURED_SERVER,
    },
  } = process;

export const app: express.Application = express();

export default (): void => {
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
      app.listen(port, onBoot({ app, port }));
    }
  };
