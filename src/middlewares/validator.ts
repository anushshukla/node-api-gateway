import { Request, Response, RequestHandler, NextFunction } from 'express';
import Joi from '@hapi/joi';

import safePromise from '../utils/safe-promise';

export default (
  joiSchema: Joi.SchemaMap<never> | undefined
): RequestHandler => async (
  request: Request,
  _response: Response,
  next: NextFunction
): Promise<void> => {
  const schema = Joi.object().keys(joiSchema);
  const [error, result] = await safePromise(schema.validateAsync(request.body));
  // eslint-disable-next-line no-console
  console.log(result);
  if (error) {
    throw error;
  }
  next();
};
