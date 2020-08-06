import fs from "fs";
import https from "https";
import express from "express";
import onBoot, { onBootParams } from "./onBoot";

export const app: express.Application = express();

export default (): void => {
  const {
    env: {
      PORT: port,
      SECURED_SERVER,
    },
  } = process;

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
    const onBootParams = { app, port } as onBootParams;
    const appListner = onBoot(onBootParams);
    app.listen(port, appListner);
  }
};
