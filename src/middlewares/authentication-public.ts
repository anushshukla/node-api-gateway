import { Request, Response, NextFunction } from 'express';

export default () => (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  // @ToDo call Public / Public Prime API for authorisation token validation
  // or check the table where the token is saved
  // till authentication takes place from the API Gateway
  return next();
};
