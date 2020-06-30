import helmet from 'helmet';
 
export default () => helmet.xssFilter();
