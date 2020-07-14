import { IncomingMessage } from "http";
import { Socket } from "net";

import { Request, Response } from "express";
import { createProxyServer, ServerOptions } from "http-proxy";
import { P2cBalancer } from "load-balancers";

import Route from "../entities/middleware";

const proxy = createProxyServer();

const requestForwarding = (
  request: Request,
  response: Response,
): void => {
  const { routeDetails } = response.locals;
  if (!routeDetails) {
    response.status(404).send(`${request.path} API not found`);
  }
  const {
    configs,
  } = routeDetails;
  const forwardRequestDomain = configs.find((config) => config.routeConfigName === "forwardRequestDomain");
  const uri = configs.find((config) => config.routeConfigName === "forwardRequestDomain");
  const balancer = new P2cBalancer(forwardRequestDomain.length);
  const target: string = forwardRequestDomain[balancer.pick()];
  const options: ServerOptions = {
    target,
    // changeOrigin: true, // needed for virtual hosted sites
    ws: true,
    xfwd: true,
    forward: uri,
  };
  //
  // Listen for the `error` event on `proxy`.
  const onProxyError = (error: Error) => {
    if (error) {
      response.writeHead(500, {
        "Content-Type": "text/plain",
      });
      response.end("Something went wrong.");
    }
  };
  proxy.on("error", onProxyError);

  //
  // Listen for the `proxyRes` event on `proxy`.
  //
  proxy.on(
    "proxyRes",
    (proxyRes: IncomingMessage, _request: Request, _response: Response) => {
      // eslint-disable-next-line no-console
      console.log(
        "RAW Response from the target",
        JSON.stringify(proxyRes.headers),
      );
    },
  );

  //
  // Listen for the `open` event on `proxy`.
  //
  // proxy.on("open", (proxySocket: Socket) => {
  //   // listen for messages coming FROM the target here
  //   proxySocket.on("data", () => {
  //     // eslint-disable-next-line no-console
  //     console.log("socket connection established");
  //   });
  // });

  //
  // Listen for the `close` event on `proxy`.
  //
  // const onProxyClose = (
  //   _response: Response,
  //   _socket: Socket,
  //   _head: never,
  // ): void => {
  //   // view disconnected websocket connections
  //   // eslint-disable-next-line no-console
  //   console.log("Client disconnected");
  // };
  // proxy.on("close", onProxyClose);

  proxy.web(request, response, options);
};

export default requestForwarding;
