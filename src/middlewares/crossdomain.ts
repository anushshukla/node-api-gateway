import { RequestHandler } from 'express';
import helmet from 'helmet';

export default (
  config: helmet.IHelmetPermittedCrossDomainPoliciesConfiguration | undefined,
): RequestHandler => helmet.permittedCrossDomainPolicies(config);
