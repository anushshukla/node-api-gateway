import { NextFunction, Request, Response } from "express";

const isAuthorizationValid = (authorization: string): boolean => {
  // @ToDo call token table in the db of core api
  return !!authorization;
}

export default () => (
  request: Request,
  response: Response,
  next: NextFunction,
): void | Response<any> => {
  const { headers: { authorization } } = request;
  if (!authorization) {
    return response.sendStatus(403);
  }
  if (!isAuthorizationValid(<string> authorization)) {
    return response.sendStatus(401);
  }
  // check token table prod_servify DB
  // @ToDo call Core API for authorization token validation
  // or check the table where the token is saved
  // till authentication takes place from the API Gateway
  return next();
};
