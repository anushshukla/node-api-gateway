import { Socket } from 'net';
import { IncomingMessage } from 'http';

import { Request, Response } from 'express';
import { P2cBalancer } from 'load-balancers';
import httpProxy from 'http-proxy';
// import safePromise from '../utils/safe-promise';

const proxy = httpProxy.createProxyServer();

const requestForwarding = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const routeDetails = response.locals;
  if (!routeDetails) {
    response.status(404).send(`${request.path} API not found`);
  }
  const {
    // method,
    forwardRequestDomain,
    uri
  } = routeDetails;
  const balancer = new P2cBalancer(forwardRequestDomain.length.length);
  const target = forwardRequestDomain[balancer.pick()];
  const options: httpProxy.ServerOptions = {
    target,
    // changeOrigin: true, // needed for virtual hosted sites
    ws: true,
    xfwd: true,
    forward: uri
  };
  //
  // Listen for the `error` event on `proxy`.
  const onProxyError = (error: Error) => {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      response.end('Something went wrong.');
    }
  };
  proxy.on('error', onProxyError);

  //
  // Listen for the `proxyRes` event on `proxy`.
  //
  proxy.on(
    'proxyRes',
    (proxyRes: IncomingMessage, _request: Request, _response: Response) => {
      // eslint-disable-next-line no-console
      console.log(
        'RAW Response from the target',
        JSON.stringify(proxyRes.headers)
      );
    }
  );

  //
  // Listen for the `open` event on `proxy`.
  //
  proxy.on('open', (proxySocket: Socket) => {
    // listen for messages coming FROM the target here
    proxySocket.on('data', () => {
      // eslint-disable-next-line no-console
      console.log('socket connection established');
    });
  });

  //
  // Listen for the `close` event on `proxy`.
  //
  const onProxyClose = (
    _response: Response,
    _socket: Socket,
    _head: never
  ): void => {
    // view disconnected websocket connections
    // eslint-disable-next-line no-console
    console.log('Client disconnected');
  };
  proxy.on('close', onProxyClose);

  return proxy.web(request, response, options);
};

export default requestForwarding;
