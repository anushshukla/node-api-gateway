import 'reflect-metadata';
import { Connection } from 'typeorm';

import safePromise from '../utils/safe-promise';

import setDatabaseConnections from './set-database-connections';

let mySqlConnection: Connection;

const getDatabaseConnection = async (): Promise<Connection> => {
  if (mySqlConnection) {
    return mySqlConnection;
  }
  const [connectionError, connection] = await safePromise(
    setDatabaseConnections()
  );
  if (connectionError) {
    throw connectionError;
  }
  mySqlConnection = connection;
  return mySqlConnection;
};

export default getDatabaseConnection;
