import {Request, Response, Application} from 'express';

export default (app: Application) : void => {
  app.get('/', (req: Request, res: Response) => {
    res.send({
      message: 'hello world',
    });
  });
};
