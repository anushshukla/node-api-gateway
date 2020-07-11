import { RequestHandler } from 'express';
import helmet from 'helmet';

export default (
  config: helmet.IHelmetDnsPrefetchControlConfiguration | undefined
): RequestHandler => helmet.dnsPrefetchControl(config);
