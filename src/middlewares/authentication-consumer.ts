import { NextFunction, Request, Response } from "express";

export default () => (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  // check token table prod_servify DB
  // @ToDo call Core API for authorisation token validation
  // or check the table where the token is saved
  // till authentication takes place from the API Gateway
  return next();
};
