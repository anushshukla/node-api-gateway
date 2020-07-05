import {Request, Response} from 'express';

const isSystemError =
    (error: Error) =>
      error instanceof EvalError ||
        error instanceof RangeError ||
        error instanceof ReferenceError ||
        error instanceof SyntaxError ||
        error instanceof TypeError ||
        error instanceof URIError;

export default () =>
  (error: any, request: Request, response: Response, next: Function) => {
    if (isSystemError(error)) {
      return response.status(500).json({message: 'Internal Server Error'});
    }
    if (error instanceof Error) {
      return response.status(500).json({message: error.message});
    }
    return next();
  };
