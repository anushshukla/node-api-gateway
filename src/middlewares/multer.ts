import { RequestHandler } from "express";
import multer from "multer";

interface Fields {
  name: string;
  maxCount: number;
}

interface MulterInterface {
  memoryStorage: boolean;
  fieldname: string;
  maxCount: number;
  isMultiple: boolean;
  fields: Fields[];
}

export default (config: MulterInterface): RequestHandler => {
  let storage;
  const { memoryStorage, isMultiple, fieldname } = config;
  if (memoryStorage) {
    storage = multer.memoryStorage();
  }
  const upload = multer({ storage });
  if (isMultiple) {
    const { fields } = config;
    if (Array.isArray(fields)) {
      return upload.fields(fields);
    }
    return upload.array(fieldname, config.maxCount);
  }
  return upload.single(fieldname);
};
