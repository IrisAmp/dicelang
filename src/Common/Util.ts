
export function shallowCopy(source: object): object {
  const result = {};
  Object.getOwnPropertyNames(source).forEach((property) => {
    result[property] = source[property];
  });
  return result;
}
