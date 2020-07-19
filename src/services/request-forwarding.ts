import * as http from "http";
import { Request, Response } from "express";
import { createProxyServer, ServerOptions } from "http-proxy";
import { P2cBalancer } from "load-balancers";

const proxy = createProxyServer();

const requestForwarding = (
  request: Request,
  response: Response,
): void => {
  const { routeDetails } = response.locals;
  if (!routeDetails) {
    throw new Error(`${request.path} route not found`);
  }
  const { transposedConfigs } = routeDetails;
  if (!transposedConfigs) {
    throw new Error(`${request.path} route config not found`);
  }
  const {
    forwardRequestDomains,
    forwardRequestUri,
  } = transposedConfigs;
  if (!forwardRequestDomains) {
    throw new Error(`${request.path} route config domain(s) not found`);
  }
  const balancer = new P2cBalancer(forwardRequestDomains.length);
  const target: string = forwardRequestDomains[balancer.pick()];
  const options: ServerOptions = {
    target,
    // changeOrigin: true, // needed for virtual hosted sites
    ws: true,
    xfwd: true,
    forward: forwardRequestUri,
  };
  //
  // Listen for the `error` event on `proxy`.
  const onProxyError = (error: Error) => {
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      // const contentType: string = "text/plain";
      // const responseObj = {
      //   "Content-Type": contentType
      // };
      // response.writeHead(500, responseObj);
      // response.end("Something went wrong.");
    }
  };
  const onProxyStart = (
      proxyReq: http.ClientRequest,
      _request: http.IncomingMessage,
      _response: http.ServerResponse,
      _options: ServerOptions
  ): void => {
    console.log(proxyReq);
  }
  proxy.on("error", onProxyError);
  proxy.on("proxyReq", onProxyStart);

  proxy.web(request, response, options);
};

export default requestForwarding;
