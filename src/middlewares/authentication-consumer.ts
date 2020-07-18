import { NextFunction, Request, Response } from "express";

const isAuthorisationValid = (authorisation: string): boolean => {
  // @ToDo call token table in the db of core api
  return !!authorisation;
}

export default () => (
  request: Request,
  response: Response,
  next: NextFunction,
): void | Response<any> => {
  const { headers: { authorisation } } = request;
  if (!authorisation) {
    return response.sendStatus(403)
  }
  if (!isAuthorisationValid(<string> authorisation)) {
    return response.sendStatus(401)
  }
  // check token table prod_servify DB
  // @ToDo call Core API for authorisation token validation
  // or check the table where the token is saved
  // till authentication takes place from the API Gateway
  return next();
};
