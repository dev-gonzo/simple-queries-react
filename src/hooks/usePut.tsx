import { useState } from "react";
import { AnyObject, ApiRequest, FetchHeaders, UseRequestHook } from "../@types";
import { isURL } from "../helpers";
import { putData } from "../libs";

export function usePut<T, B = AnyObject, P = AnyObject>(
  props: UseRequestHook<T> | string | undefined | AnyObject = {}
) {
  let propsPut: UseRequestHook = {
    endpoint: undefined,
    errorFn: undefined,
    headers: undefined,
    url: undefined,
    apiName: undefined,
    onSuccess: undefined,
    bodyURLSearchParams: undefined,
  };
  const [response, setResponse] = useState<T | undefined>(undefined);
  const [msgErrors, setMsgErrors] = useState<any>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  if (typeof props === "object" && props !== null && !Array.isArray(props)) {
    const { endpoint, errorFn, headers, url, apiName, onSuccess } =
      props as UseRequestHook;
    propsPut = { endpoint, errorFn, headers, url, apiName, onSuccess };
  } else if (typeof props === "string") {
    if (isURL(props)) {
      propsPut.url = props;
    } else {
      propsPut.endpoint = props;
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
    propsPut?.errorFn && propsPut.errorFn(data);
  };

  const clearErrors = () => {
    setError(false);
    setMsgErrors(undefined);
  };

  const setHeaders = (headers: FetchHeaders) => {
    if (headers) {
      propsPut.headers = headers;
    }
  };

  const request = async ({
    params,
    pathRest,
    body,
    bodyURLSearchParams,
  }: Partial<
    Pick<ApiRequest, "params" | "pathRest" | "body" | "bodyURLSearchParams">
  >) => {
    setLoading(true);
    setMsgErrors(undefined);
    setError(false);
    setSuccess(false);

    await putData({
      endpoint: propsPut?.endpoint,
      params,
      pathRest,
      headers: propsPut.headers,
      errorFn: handleSetErrors,
      url: propsPut.url,
      body: body,
      apiName: propsPut?.apiName,
      onSuccess: propsPut?.onSuccess,
      bodyURLSearchParams: bodyURLSearchParams,
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
    bodyURLSearchParams: AnyObject;
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
        bodyURLSearchParams: dataBodyURLSearchParams,
      } = data as Send;

      if (
        dataParams != undefined ||
        dataPathRest != undefined ||
        dataBody != undefined ||
        dataBodyURLSearchParams != undefined
      ) {
        options = {
          params: (dataParams as P) ?? undefined,
          pathRest: (dataPathRest as AnyObject | undefined) ?? undefined,
          body: (dataBody as B) ?? undefined,
          bodyURLSearchParams:
            (dataBodyURLSearchParams as AnyObject | undefined) ?? undefined,
        };
      } else {
        options.body = (data as B) ?? undefined;
      }
    } else if (typeof data === "string" || typeof data === "number") {
      propsPut.endpoint = propsPut.endpoint
        ? `${propsPut.endpoint}/${data}`
        : `${data}`;
    }

    request({
      params: options?.params ?? ({} as AnyObject | undefined),
      pathRest: options?.pathRest as AnyObject | undefined,
      body: options?.body as AnyObject | undefined,
      bodyURLSearchParams: options?.bodyURLSearchParams as
        | AnyObject
        | undefined,
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
    msgErrors,
  };
}
