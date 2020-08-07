import { NextFunction, Request, Response } from "express";
import axios from 'axios';
import safePromise from "../utils/safe-promise";

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
type PublicAuthentication = void | Response<any>;
export default () => async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<PublicAuthentication> => {
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
  if (isAuthorisationValid(<string>clientId, <string>host, <string>date, <string>hmac, <string>clientSessionId)) {
    return response.sendStatus(401)
  }
  const primeUrl = 'http://172.21.3.28:4000/api/v1/authentication/check';
  const [error, primeResponse] = await safePromise(axios.get(primeUrl));
  if (error) {
    return next(error)
  }
  if (!primeResponse) {
    return response.sendStatus(500);
  }
  if (primeResponse.status !== 200) {
    response.send(response);
  }
  // check token table prod_servify DB
  // @ToDo call Core API for authorisation token validation
  // or check the table where the token is saved
  // till authentication takes place from the API Gateway
  return next();
};
