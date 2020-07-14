import { NextFunction, Request, Response } from "express";

// This middleware check if the
export default () => (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  // call to redis for the toke
  // @ToDo call Public / Public Prime API for authorisation token validation
  // or check the table where the token is saved
  // till authentication takes place from the API Gateway
  return next();
};
