/**
 * Creates an object composed of the picked object properties.
 * @param {Object} object The source object.
 * @param {string[]} keys The property paths to pick.
 * @returns {Object} Returns the new object.
 */
export const pick = (object: object, keys: string[]): object => {
  return keys.reduce((obj: any, key: string) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = (object as any)[key];
    }
    return obj;
  }, {});
}; 