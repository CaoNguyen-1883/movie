/* eslint-disable no-param-reassign */
import { Schema, Document } from 'mongoose';

/**
 * Adds a `private` option to schema types.
 * If true, the path is deleted from the object before returning from `toJSON`.
 */
declare module 'mongoose' {
  interface SchemaTypeOptions<T> {
    private?: boolean;
  }
}

/**
 * A mongoose schema plugin which applies the following in the toJSON transform call:
 *  - removes __v
 *  - removes any path with a `private: true` option
 *  - replaces _id with id
 */
const toJSON = <T extends Document>(schema: Schema<T>) => {
  let transform: any;

  const schemaToJSONOptions = schema.get('toJSON');
  if (schemaToJSONOptions && typeof schemaToJSONOptions.transform === 'function') {
    transform = schemaToJSONOptions.transform;
  }

  schema.set('toJSON', {
    ...schemaToJSONOptions,
    transform(doc: Document, ret: any, options: any) {
      // Remove any path that has a private option
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options && schema.paths[path].options.private) {
          delete ret[path];
        }
      });

      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;

      // The password field should have been removed by the private: true option,
      // but we delete it here again as a safeguard.
      delete ret.password;

      if (transform) {
        return transform(doc, ret, options);
      }

      return ret;
    },
  });
};

export default toJSON; 