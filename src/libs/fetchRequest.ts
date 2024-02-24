import { ApiRequest, MethodsRequest } from "../@types";
import {
  buildURLFromMap,
  endsWithSlash,
  flattenObject,
  removeNullValues,
  removeUndefinedValues,
} from "../helpers";

export const fetchRequest = async ({
  url = "",
  endpoint,
  errorFn,
  pathRest,
  params,
  body,
  headers,
  methods = "GET",
}: Partial<ApiRequest & { methods: MethodsRequest }> = {}) => {
  try {
    let fullPath: string = endpoint ? `${endpoint}` : "";

    if (pathRest) {
      fullPath = `${
        fullPath && !endsWithSlash(fullPath) ? `${fullPath}/` : ""
      }${buildURLFromMap(flattenObject(pathRest))}`;
    }

    if (url) {
      fullPath = `${url}${
        fullPath ? `${endsWithSlash(url) ? "" : "/"}${fullPath}` : ""
      }`;
    }

    if (params) {
      const transformParams = removeNullValues(
        removeUndefinedValues(flattenObject(params))
      );
      const queryParams = new URLSearchParams(transformParams).toString();
      fullPath = queryParams ? `${fullPath}?${queryParams}` : fullPath;
    }

    const response = await fetch(fullPath, {
      method: methods ? methods : "GET",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (err: any) {
    if (errorFn) {
      errorFn(err);
    }
    throw err?.response;
  }
};
