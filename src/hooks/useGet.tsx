import { useState } from "react";
import { AnyObject, ApiRequest, FetchHeaders, UseRequestHook } from "../@types";
import { isURL } from "../helpers";
import { getData } from "../libs";

export function useGet<T, P = AnyObject, B = AnyObject>(
  props: UseRequestHook<T> | string | undefined | AnyObject = {}
) {
  let propsGet: UseRequestHook = {
    endpoint: undefined,
    errorFn: undefined,
    headers: undefined,
    url: undefined,
    apiName: undefined,
    onSuccess: undefined,
  };
  const [response, setResponse] = useState<T | undefined>(undefined);
  const [msgErrors, setMsgErrors] = useState<any>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  if (typeof props === "object" && props !== null && !Array.isArray(props)) {
    const { endpoint, errorFn, headers, url, apiName, onSuccess } =
      props as UseRequestHook;
    propsGet = { endpoint, errorFn, headers, url, apiName, onSuccess };
  } else if (typeof props === "string") {
    if (isURL(props)) {
      propsGet.url = props;
    } else {
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
    return msgErrors;
  };

  const handleSetErrors = (data: any) => {
    setMsgErrors(data);
    propsGet?.errorFn && propsGet.errorFn(data);
  };

  const clearErrors = () => {
    setMsgErrors(undefined);
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
    setMsgErrors(undefined);

    await getData({
      endpoint: propsGet?.endpoint,
      params,
      pathRest,
      headers: propsGet.headers,
      errorFn: handleSetErrors,
      url: propsGet.url,
      body,
      apiName: propsGet?.apiName,
      onSuccess: propsGet?.onSuccess,
    })
      .then((res) => {
        setSuccess(true);
        setError(false);
        setResponse(res);
      })
      .catch(() => {
        setSuccess(false);
        setError(true);
        setResponse(undefined);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  type Send = Partial<{
    pathRest: AnyObject;
    params: P;
    body: B;
  }>;

  const send = (
    data: Partial<Send> | AnyObject | P | number | string | undefined = {}
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
        options.params = (data as P) ?? undefined;
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
    success,
    error,
  };
}
