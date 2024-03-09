import { useState } from "react";
import { AnyObject, ApiRequest, FetchHeaders, UseRequestHook } from "../@types";
import { isURL } from "../helpers";
import { deleteData } from "../libs";

export function useDelete<T, B = AnyObject, P = AnyObject>(
  props: UseRequestHook<T> | string | undefined | AnyObject = {}
) {
  let propsDelete: UseRequestHook = {
    endpoint: undefined,
    errorFn: undefined,
    headers: undefined,
    url: undefined,
    apiName: undefined,
    onSuccess: undefined,
  };
  const [response, setResponse] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [msgErrors, setMsgErrors] = useState<any>(undefined);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  if (typeof props === "object" && props !== null && !Array.isArray(props)) {
    const { endpoint, errorFn, headers, url, apiName, onSuccess } =
      props as UseRequestHook;
    propsDelete = { endpoint, errorFn, headers, url, apiName, onSuccess };
  } else if (typeof props === "string") {
    if (isURL(props)) {
      propsDelete.url = props;
    } else {
      propsDelete.endpoint = props;
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
    propsDelete?.errorFn && propsDelete.errorFn(data);
  };

  const clearErrors = () => {
    setMsgErrors(undefined);
  };

  const setHeaders = (headers: FetchHeaders) => {
    if (headers) {
      propsDelete.headers = headers;
    }
  };

  const request = async ({
    params,
    pathRest,
    body,
  }: Partial<Pick<ApiRequest, "params" | "pathRest" | "body">>) => {
    setLoading(true);
    setMsgErrors(undefined);

    await deleteData({
      endpoint: propsDelete?.endpoint,
      params,
      pathRest,
      headers: propsDelete.headers,
      errorFn: handleSetErrors,
      url: propsDelete.url,
      body: body,
      apiName: propsDelete?.apiName,
      onSuccess: propsDelete?.onSuccess,
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
      propsDelete.endpoint = propsDelete.endpoint
        ? `${propsDelete.endpoint}/${data}`
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
