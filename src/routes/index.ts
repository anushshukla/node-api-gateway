import { Application, Request, Response } from "express";
// import axios from 'axios';

import fetchRouteMiddleware from "../middlewares/fetch-route-middleware";
import requestForwarding from "../services/request-forwarding";

export default (app: Application): void => {
  app.get("/", (request: Request, response: Response) => {
    response.send({
      hostname: request.hostname,
      path: request.path,
      method: request.method,
    });
  });

  app
    .get("*", fetchRouteMiddleware, requestForwarding)
    .post("*", fetchRouteMiddleware, requestForwarding)
    .put("*", fetchRouteMiddleware, requestForwarding)
    .delete("*", fetchRouteMiddleware, requestForwarding);
};
