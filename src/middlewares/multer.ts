import multer from 'multer';

interface MulterInterface {
    memoryStorage: boolean
}

export default (config: MulterInterface ) => {
  let storage;
  if (config.memoryStorage) {
    storage = multer.memoryStorage();
  }
  return multer({storage});
};
