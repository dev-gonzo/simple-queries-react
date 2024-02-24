import { capitalizeFirstLetter } from "./capitalizeFirstLetter";

export const flattenObject = (input: any, parentKey = ""): any => {
  return Object.keys(input).reduce((acc, key) => {
    const newKey = parentKey
      ? `${parentKey}${capitalizeFirstLetter(key)}`
      : key;

    if (typeof input[key] === "object" && input[key] !== null) {
      return { ...acc, ...flattenObject(input[key], newKey) };
    } else {
      return { ...acc, [newKey]: input[key] };
    }
  }, {});
};
