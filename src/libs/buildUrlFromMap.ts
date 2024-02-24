import { PathMap } from "../@types";

export const buildURLFromMap = (pathMap: PathMap): string => {
  return Object.entries(pathMap)
    .map(([key, value]) =>
      value !== null && value !== undefined ? `${key}/${value}` : key
    )
    .join("/");
};
