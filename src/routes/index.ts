import {Request, Response, Application} from 'express';
import axios from 'axios';
import fetchRouteMiddleware from '../middlewares/fetchRouteMiddleware';

export default (app: Application): void => {
  app.use(fetchRouteMiddleware);

  app.get('/', (request: Request, response: Response) => {
    response.send({
      hostname: request.hostname,
      path: request.path,
      method: request.method,
    });
  });

  let cur = 0;

  const requestsForwarding = (request: Request, response: Response) => {
    // response.status(404).send('what???');
    const { servers } = request;
    const method = request.method;
    const _req = axios({ method, url: servers[cur] + request.url })
      .on('error', error => {
        response.status(500).send(error.message);
      });
    request.pipe(_req).pipe(response);
    cur = (cur + 1) % servers.length;
  };
  app
    .get('*', requestsForwarding)
    .post('*', requestsForwarding)
    .put('*', requestsForwarding)
    .delete('*', requestsForwarding)
  ;
};
