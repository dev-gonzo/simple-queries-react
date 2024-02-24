import { AnyObject } from "../@types";

export const removeUndefinedValues = (obj: AnyObject) => {
  const newObj: AnyObject = {};
  for (let key in obj) {
    if (obj[key] !== undefined && typeof obj[key] !== "undefined") {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        newObj[key] = removeUndefinedValues(obj[key]);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  return newObj;
};
