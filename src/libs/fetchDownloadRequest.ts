import {
  ApiRequest,
  FetchDownload,
  FetchHeaders,
  SimpleQueriesConfig
} from "../@types";
import {
  buildURLFromMap,
  endsWithSlash,
  flattenObject,
  removeNullValues,
  removeUndefinedValues,
} from "../helpers";
import { getConfig } from "./config";

export const fetchDownloadRequest = async ({
  url = "",
  endpoint,
  errorFn,
  pathRest,
  params,
  headers,
  methods = "GET",
  apiName = undefined,
  fileName = ["download", "pdf"],
  download = true,
}: FetchDownload = {}) => {
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
        ...configHeaders,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const contentDispositionHeader = response.headers.get(
      "Content-Disposition"
    );

    const match =
      contentDispositionHeader &&
      contentDispositionHeader.match(/filename="(.+)"/);

    let fileNameDowanload = fileName.join(".");

    if (match) {
      fileNameDowanload = match[1];
    }

    const fileExtension = fileNameDowanload.split(".").pop();

    const blob = await response.blob();
    const urlDownload = window.URL.createObjectURL(blob);

    if (!download) {
      return urlDownload;
    }

    const a = document.createElement("a");
    a.href = urlDownload;
    a.download = fileNameDowanload;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(urlDownload);

    return fileExtension;
  } catch (err: any) {
    if (errorFn) {
      errorFn(err);
    }
    throw err?.response;
  }
};
