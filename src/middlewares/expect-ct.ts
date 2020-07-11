import { RequestHandler } from 'express';
import helmet from 'helmet';

export default (
  config: helmet.IHelmetExpectCtConfiguration | undefined
): RequestHandler => helmet.expectCt(config);
