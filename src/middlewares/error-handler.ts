import { Request, Response, NextFunction } from 'express';

const isSystemError = (error: Error) =>
  error instanceof EvalError ||
  error instanceof RangeError ||
  error instanceof ReferenceError ||
  error instanceof SyntaxError ||
  error instanceof TypeError ||
  error instanceof URIError;

type InternalServerError =
  | EvalError
  | RangeError
  | ReferenceError
  | SyntaxError
  | TypeError
  | URIError
  | Error;

export default () => (
  error: InternalServerError,
  request: Request,
  response: Response,
  next: NextFunction,
): Response | void => {
  if (isSystemError(error)) {
    return response.status(500).json({ message: 'Internal Server Error' });
  }
  if (error instanceof Error) {
    return response.status(500).json({ message: error.message });
  }
  return next();
};
