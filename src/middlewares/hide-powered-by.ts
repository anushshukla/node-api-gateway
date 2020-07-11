import { RequestHandler } from 'express';
import helmet from 'helmet';

export default (
  config: helmet.IHelmetHidePoweredByConfiguration | undefined
): RequestHandler => helmet.hidePoweredBy(config);
