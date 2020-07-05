import {
  createConnection,
  Connection,
  ConnectionOptions,
} from 'typeorm';
import safePromise from '../utils/safePromise';
import Route from '../entities/route';
import Middleware from '../entities/middleware';

export default async (): Promise<Connection> => {
  // const type: string = (process.env.DB_TYPE as string);
  const host: string = (process.env.DB_HOST as string);
  const port: number = (process.env.DB_PORT as unknown as number);
  const username: string = (process.env.DB_USER as string);
  const password: string = (process.env.DB_PASS as string);
  const database: string = (process.env.DB_NAME as string);
  const connectionOptions: ConnectionOptions = {
    type: 'mysql',
    host,
    port,
    username,
    password,
    database,
    entities: [
      Route,
      Middleware,
    ],
    synchronize: true,
    logging: false,
  };
  const [connectionError, connection] = await safePromise(
    createConnection(connectionOptions),
  );
  if (connectionError) {
    throw connectionError;
  }
  return connection;
};
