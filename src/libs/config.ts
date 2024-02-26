import { FetchHeaders, SimpleQueriesConfig } from "../@types";

let configSimpleQueries: SimpleQueriesConfig = {
  baseUrl: "",
  bearerToken: undefined,
  headers: undefined,
  APIs: undefined,
};

export const initSimpleQueries = (
  config: Partial<SimpleQueriesConfig>
): void => {
  configSimpleQueries = { ...configSimpleQueries, ...config };
};

export const getConfig = (): SimpleQueriesConfig => {
  return configSimpleQueries;
};

export const setBearerToken = (
  token: string | null | undefined,
  apiName: string | undefined = undefined
): void => {
  if (token != undefined) {
    if (apiName) {
      const index = configSimpleQueries?.APIs?.findIndex(
        (item) => item?.name === apiName
      );

      if (index && index > -1) {
        configSimpleQueries.APIs![index].bearerToken = token;
      }

      return;
    }

    configSimpleQueries = { ...configSimpleQueries, bearerToken: token };
  }
};

export const cleanBearerToken = (
  apiName: string | undefined = undefined
): void => {
  if (apiName) {
    const index = configSimpleQueries?.APIs?.findIndex(
      (item) => item?.name === apiName
    );

    if (index && index > -1) {
      configSimpleQueries.APIs![index].bearerToken = undefined;
    }

    return;
  }

  configSimpleQueries = { ...configSimpleQueries, bearerToken: undefined };
};

export const setHeaders = (
  headers: FetchHeaders | undefined,
  apiName: string | undefined = undefined
): void => {
  if (headers) {
    if (apiName) {
      const index = configSimpleQueries?.APIs?.findIndex(
        (item) => item?.name === apiName
      );

      if (index && index > -1) {
        configSimpleQueries.APIs![index].headers = headers;
      }

      return;
    }
    configSimpleQueries = { ...configSimpleQueries, headers: headers };
  }
};
