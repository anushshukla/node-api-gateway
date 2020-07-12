import { RequestHandler } from 'express';
import helmet from 'helmet';

export default (
  config: helmet.IHelmetFrameguardConfiguration | undefined,
): RequestHandler => helmet.frameguard(config);
