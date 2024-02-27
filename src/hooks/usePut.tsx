import { useState } from "react";
import { AnyObject, ApiRequest, FetchHeaders, UseRequestHook } from "../@types";
import { isURL } from "../helpers";
import { putData } from "../libs";

export function usePut<T, B = AnyObject, P = AnyObject>(
  props: UseRequestHook | string | undefined | AnyObject = {}
) {
  let propsPut: UseRequestHook = {
    endpoint: undefined,
    errorFn: undefined,
    headers: undefined,
    url: undefined,
    apiName: undefined,
  };
  const [response, setResponse] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>(undefined);

  if (typeof props === "object" && props !== null && !Array.isArray(props)) {
    const { endpoint, errorFn, headers, url, apiName } =
      props as UseRequestHook;
    propsPut = { endpoint, errorFn, headers, url, apiName };
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
    return errors;
  };

  const handleSetErrors = (data: any) => {
    setErrors(data);
    propsPut?.errorFn && propsPut.errorFn(data);
  };

  const clearErrors = () => {
    setErrors(undefined);
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
  }: Partial<Pick<ApiRequest, "params" | "pathRest" | "body">>) => {
    setLoading(true);
    setErrors(undefined);

    await putData({
      endpoint: propsPut?.endpoint,
      params,
      pathRest,
      headers: propsPut.headers,
      errorFn: handleSetErrors,
      url: propsPut.url,
      body: body,
      apiName: propsPut?.apiName,
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
      propsPut.endpoint = propsPut.endpoint
        ? `${propsPut.endpoint}/${data}`
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
