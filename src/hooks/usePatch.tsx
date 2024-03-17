import { useState } from "react";
import { AnyObject, ApiRequest, FetchHeaders, UseRequestHook } from "../@types";
import { isURL } from "../helpers";
import { patchData } from "../libs";

export function usePatch<T, B = AnyObject, P = AnyObject>(
  props: UseRequestHook<T> | string | undefined | AnyObject = {}
) {
  let propsPatch: UseRequestHook = {
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
    propsPatch = { endpoint, errorFn, headers, url, apiName, onSuccess };
  } else if (typeof props === "string") {
    if (isURL(props)) {
      propsPatch.url = props;
    } else {
      propsPatch.endpoint = props;
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
    propsPatch?.errorFn && propsPatch.errorFn(data);
  };

  const clearErrors = () => {
    setError(false);
    setMsgErrors(undefined);
  };

  const setHeaders = (headers: FetchHeaders) => {
    if (headers) {
      propsPatch.headers = headers;
    }
  };

  const request = async ({
    params,
    pathRest,
    body,
  }: Partial<Pick<ApiRequest, "params" | "pathRest" | "body">>) => {
    setLoading(true);
    setMsgErrors(undefined);
    setError(false);
    setSuccess(false);

    await patchData({
      endpoint: propsPatch?.endpoint,
      params,
      pathRest,
      headers: propsPatch.headers,
      errorFn: handleSetErrors,
      url: propsPatch.url,
      body: body,
      apiName: propsPatch?.apiName,
      onSuccess: propsPatch?.onSuccess,
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
      propsPatch.endpoint = propsPatch.endpoint
        ? `${propsPatch.endpoint}/${data}`
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
    msgErrors,
    success,
    error,
  };
}
