import { RequestHandler } from 'express';
import helmet from 'helmet';

export default (
  config: helmet.IHelmetContentSecurityPolicyConfiguration
): RequestHandler => helmet.contentSecurityPolicy(config);
