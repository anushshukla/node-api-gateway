import {Request, Response} from 'express';
import Joi from '@hapi/joi';
import safePromise from '../utils/safePromise';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (joiSchema: any) =>
  async (
    request: Request,
    _response: Response,
    next: Function,
  ): Promise<any> => {
    const schema = Joi.object().keys(joiSchema);
    const [error, result] = await safePromise(
      schema.validateAsync(request.body),
    );
    // eslint-disable-next-line no-console
    console.log(result);
    if (error) {
      throw error;
    }
    await next();
  };
