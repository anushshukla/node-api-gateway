import helmet from 'helmet';
 
export default (config: any) => helmet.hsts(config);
