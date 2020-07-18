import { NextFunction, Request, Response } from "express";

const isAuthorisationValid = (clientId: string, host: string, date: string, hmac: string, clientSessionId: string): boolean => {
  // @ToDo check redis of public prime api
  const authorisationKeys = {
    clientId,
    host,
    date,
    hmac,
    clientSessionId
  }
  return !!authorisationKeys;
}

type isAnyValueEmptyType = (...argument: any[]) => boolean;

const isAnyValueEmpty: isAnyValueEmptyType = (...authorisationKeys) => {
  let isEmpty = false;
  authorisationKeys.map(authorisationKey => {
      if (!authorisationKey) {
        isEmpty = true;
        return;
      }
  });
  return isEmpty;
}
export default () => (
  request: Request,
  response: Response,
  next: NextFunction,
): void | Response<any> => {
  const { headers: {
    client_id: clientId,
    x_host: host,
    x_date: date,
    hmac_signature: hmac,
    client_session_id: clientSessionId,
  } } = request;
  
  if (isAnyValueEmpty(clientId, host, date, hmac, clientSessionId)) {
    return response.sendStatus(403)
  }
  if (isAuthorisationValid(<string> clientId, <string> host, <string> date, <string> hmac, <string> clientSessionId)) {
    return response.sendStatus(401)
  }
  // check token table prod_servify DB
  // @ToDo call Core API for authorisation token validation
  // or check the table where the token is saved
  // till authentication takes place from the API Gateway
  return next();
};
