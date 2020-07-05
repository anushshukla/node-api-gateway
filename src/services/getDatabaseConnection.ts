import 'reflect-metadata';
import {Connection} from 'typeorm';
import setDatabaseConnections from '../services/setDatabaseConnections';
import safePromise from '../utils/safePromise';

let mySqlConnection: Connection;

export default async (): Promise<any> => {
  if (mySqlConnection) {
    return mySqlConnection;
  }
  const [connectionError, connection] = await safePromise(
    setDatabaseConnections(),
  );
  if (connectionError) {
    throw connectionError;
  }
  mySqlConnection = connection;
  return mySqlConnection;
};
