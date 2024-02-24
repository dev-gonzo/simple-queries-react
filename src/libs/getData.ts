import { ApiRequest } from "../@types";
import { endsWithSlash } from "../helpers";
import { buildURLFromMap } from "./buildUrlFromMap";

import { flattenObject } from "./flattenObject";

export const getData = async ({
  url = "",
  endpoint,
  errorFn,
  pathRest,
  params,
  body,
  headers,
}: Partial<ApiRequest> = {}) => {
  try {
    let fullPath: string = endpoint ? `${endpoint}` : "";

    if (pathRest) {
      fullPath = `${fullPath}/${buildURLFromMap(flattenObject(pathRest))}`;
    }

    if (url) {
      fullPath = `${url}${
        fullPath ? `${endsWithSlash(url) ? "" : "/"}${fullPath}` : ""
      }`;
    }

    if (params) {
      console.log(fullPath);
      const queryParams = new URLSearchParams(params).toString();
      fullPath = queryParams ? `${fullPath}?${queryParams}` : fullPath;
    }

    const response = await fetch(fullPath, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    return await response.json();
  } catch (err: any) {
    if (errorFn) {
      errorFn(err);
    }
    throw err?.response;
  }
};
