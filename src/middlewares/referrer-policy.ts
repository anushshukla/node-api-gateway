import { RequestHandler } from 'express';
import helmet from 'helmet';

type referrerPolicyConfig =
  | helmet.IHelmetReferrerPolicyConfiguration
  | undefined;

export default (config: referrerPolicyConfig): RequestHandler =>
  helmet.referrerPolicy(config);
