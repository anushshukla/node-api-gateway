import helmet, {IHelmetXssFilterConfiguration} from 'helmet';

export default (config: IHelmetXssFilterConfiguration): Function =>
  helmet.xssFilter(config);
