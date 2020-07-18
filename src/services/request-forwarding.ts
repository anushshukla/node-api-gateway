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
    response.status(404).send(`${request.path} API not found`);
  }
  const {
    forwardRequestDomain,
    uri,
  } = routeDetails.transposedConfigs;
  if (!forwardRequestDomain) {
    response.status(500).send(`Missing config`);
  }
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
      const contentType: string = "text/plain";
      const responseObj = {
        "Content-Type": contentType
      };
      response.writeHead(500, responseObj);
      response.end("Something went wrong.");
    }
  };
  proxy.on("error", onProxyError);

  proxy.web(request, response, options);
};

export default requestForwarding;
