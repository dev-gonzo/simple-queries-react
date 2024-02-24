import { useState } from "react";
import { AnyObject, ApiRequest, FetchHeaders, UseGet } from "../@types";
import { isURL } from "../helpers";
import { patchData } from "../libs";

export function usePatch<T, B = AnyObject, P = AnyObject>(
  props: UseGet | string | undefined | AnyObject = {}
) {
  let propsGet: UseGet = {
    endpoint: undefined,
    errorFn: undefined,
    headers: undefined,
    url: undefined,
  };
  const [response, setResponse] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>(undefined);

  if (typeof props === "object" && props !== null && !Array.isArray(props)) {
    const { endpoint, errorFn, headers, url } = props as UseGet;
    propsGet = { endpoint, errorFn, headers, url };
  } else if (typeof props === "string") {
    if (isURL(props)) {
      propsGet.url = props;
    }else {
      propsGet.endpoint = props;
    }
  }

  const getResponse = () => {
    return response;
  };

  const clearResponse = () => {
    setResponse(undefined);
  };

  const isLoading = () => {
    return loading;
  };

  const cancelLoading = () => {
    setLoading(false);
  };

  const getErrors = () => {
    return errors;
  };

  const handleSetErrors = (data: any) => {
    setErrors(data);
    propsGet?.errorFn && propsGet.errorFn(data);
  };

  const clearErrors = () => {
    setErrors(undefined);
  };

  const setHeaders = (headers: FetchHeaders) => {
    if (headers) {
      propsGet.headers = headers;
    }
  };

  const request = async ({
    params,
    pathRest,
    body,
  }: Partial<Pick<ApiRequest, "params" | "pathRest" | "body">>) => {
    setLoading(true);
    setErrors(undefined);

    await patchData({
      endpoint: propsGet?.endpoint,
      params,
      pathRest,
      headers: propsGet.headers,
      errorFn: handleSetErrors,
      url: propsGet.url,
      body: body,
    })
      .then((res) => {
        setResponse(res);
      })
      .catch(() => {
        setResponse(undefined);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  type Send = Partial<{
    body: B;
    pathRest: AnyObject;
    params: P;
  }>;

  const send = (
    data: Partial<Send> | AnyObject | B | number | string | undefined = {}
  ) => {
    let options: Send | undefined = {};

    if (typeof data === "object" && props !== null && !Array.isArray(props)) {
      const {
        params: dataParams,
        pathRest: dataPathRest,
        body: dataBody,
      } = data as Send;

      if (
        dataParams != undefined ||
        dataPathRest != undefined ||
        dataBody != undefined
      ) {
        options = {
          params: (dataParams as P) ?? undefined,
          pathRest: (dataPathRest as AnyObject | undefined) ?? undefined,
          body: (dataBody as B) ?? undefined,
        };
      } else {
        options.body = (data as B) ?? undefined;
      }
    } else if (typeof data === "string" || typeof data === "number") {
      propsGet.endpoint = propsGet.endpoint
        ? `${propsGet.endpoint}/${data}`
        : `${data}`;
    }

    request({
      params: options?.params ?? ({} as AnyObject | undefined),
      pathRest: options?.pathRest as AnyObject | undefined,
      body: options?.body as AnyObject | undefined,
    });
  };

  return {
    getResponse,
    send,
    clearResponse,
    isLoading,
    cancelLoading,
    getErrors,
    clearErrors,
    setHeaders,
  };
}
