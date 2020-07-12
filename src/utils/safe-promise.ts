const safePromise = async <T>(
  promise: Promise<T>,
): Promise<[Error] | [null, T]> => {
  try {
    return [null, await promise];
  } catch (error) {
    return [error];
  }
};

export default safePromise;
