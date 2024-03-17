import {
  ApiRequest,
  FetchHeaders,
  MethodsRequest,
  SimpleQueriesConfig,
} from "../@types";
import {
  buildURLFromMap,
  endsWithSlash,
  flattenObject,
  removeNullValues,
  removeUndefinedValues,
} from "../helpers";
import { getConfig } from "./config";

export const fetchRequest = async ({
  url = "",
  endpoint,
  errorFn,
  pathRest,
  params,
  body,
  headers,
  methods = "GET",
  apiName = undefined,
  onSuccess,
  bodyURLSearchParams
}: Partial<ApiRequest> = {}) => {
  const config: SimpleQueriesConfig = getConfig();
  const apiConfig = config?.APIs?.find((item) => item?.name === apiName);

  let configHeaders: FetchHeaders | undefined = undefined;

  if (apiConfig) {
    configHeaders = {
      ...apiConfig?.headers,
      ...headers,
    };
  } else {
    configHeaders = {
      ...config?.headers,
      ...headers,
    };
  }

  if (config?.bearerToken || apiConfig?.bearerToken) {
    const enableDefaultToken =
      apiConfig?.enableDefaultToken !== undefined
        ? apiConfig?.enableDefaultToken
        : true;

    if (apiConfig?.bearerToken !== undefined) {
      configHeaders = {
        ...configHeaders,
        Authorization: `Bearer ${apiConfig?.bearerToken}`,
      };
    } else if (apiConfig && enableDefaultToken) {
      configHeaders = {
        ...configHeaders,
        Authorization: `Bearer ${config.bearerToken}`,
      };
    } else if (config?.bearerToken) {
      configHeaders = {
        ...configHeaders,
        Authorization: `Bearer ${config.bearerToken}`,
      };
    }
  }

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
    } else if (apiConfig?.baseUrl) {
      fullPath = `${apiConfig?.baseUrl}${
        fullPath
          ? `${endsWithSlash(apiConfig?.baseUrl) ? "" : "/"}${fullPath}`
          : ""
      }`;
    } else if (config?.baseUrl) {
      fullPath = `${config?.baseUrl}${
        fullPath
          ? `${endsWithSlash(config?.baseUrl) ? "" : "/"}${fullPath}`
          : ""
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
        ...configHeaders,
      },
      body: bodyURLSearchParams ? new URLSearchParams(bodyURLSearchParams) : JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(JSON.stringify(response));
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const resp = await response.json();
      onSuccess && onSuccess(resp);
      return resp;
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
