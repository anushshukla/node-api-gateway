import rateLimit from 'express-rate-limit';

export default (config: any) => rateLimit(config);
