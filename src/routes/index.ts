import {Request, Response, Application} from 'express';
import fetchRouteMiddleware from '../middlewares/fetchRouteMiddleware';

export default (app: Application) : void => {
  app.use(fetchRouteMiddleware);
  app.get('/', (request: Request, response: Response) => {
    response.send({
      hostname: request.hostname,
      path: request.path,
      method: request.method,
    });
  });

  app.get('*', function(req, res){
    res.status(404).send('what???');
  });
};
