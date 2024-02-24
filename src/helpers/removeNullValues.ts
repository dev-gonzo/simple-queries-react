import { AnyObject } from "../@types";

export const removeNullValues = (obj: AnyObject) => {
  const newObj: AnyObject = {};
  for (let key in obj) {
    if (obj[key] !== null && typeof obj[key] === "object") {
      newObj[key] = removeNullValues(obj[key]);
    } else if (obj[key] !== null) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};
