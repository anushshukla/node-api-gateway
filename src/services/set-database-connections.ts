import {
  createConnection,
  Connection,
  ConnectionOptions,
  getConnectionOptions,
} from 'typeorm';

import safePromise from '../utils/safe-promise';

const setDatabaseConnections = async (): Promise<Connection> => {
  const connectionOptions: ConnectionOptions = await getConnectionOptions();
  const [connectionError, connection] = await safePromise(
    createConnection(connectionOptions),
  );
  if (connectionError) {
    throw connectionError;
  }
  return connection;
};

export default setDatabaseConnections;
