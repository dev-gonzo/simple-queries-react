import { useState } from "react";
import {
  AnyObject,
  Extension,
  FetchDownload,
  FetchHeaders,
  UseDownloadHook,
} from "../@types";
import { isURL } from "../helpers";
import { downloadData } from "../libs";

export function useDownload<P = AnyObject>(
  props: UseDownloadHook | string | undefined | AnyObject = {}
) {
  let propsDownload: UseDownloadHook = {
    endpoint: undefined,
    errorFn: undefined,
    headers: undefined,
    url: undefined,
    apiName: undefined,
    defaultName: undefined,
    download: undefined,
    extension: undefined,
  };
  const [response, setResponse] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>(undefined);

  if (typeof props === "object" && props !== null && !Array.isArray(props)) {
    const {
      endpoint,
      errorFn,
      headers,
      url,
      apiName,
      defaultName,
      download,
      extension,
    } = props as UseDownloadHook;
    propsDownload = {
      endpoint,
      errorFn,
      headers,
      url,
      apiName,
      defaultName,
      download,
      extension,
    };
  } else if (typeof props === "string") {
    if (isURL(props)) {
      propsDownload.url = props;
    } else {
      propsDownload.endpoint = props;
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
    propsDownload?.errorFn && propsDownload.errorFn(data);
  };

  const clearErrors = () => {
    setErrors(undefined);
  };

  const setHeaders = (headers: FetchHeaders) => {
    if (headers) {
      propsDownload.headers = headers;
    }
  };

  const request = async ({
    params,
    pathRest,
    download,
    fileName,
  }: Partial<FetchDownload>) => {
    setLoading(true);
    setErrors(undefined);

    await downloadData({
      endpoint: propsDownload?.endpoint,
      params,
      pathRest,
      headers: propsDownload.headers,
      errorFn: handleSetErrors,
      url: propsDownload.url,
      apiName: propsDownload?.apiName,
      fileName: fileName,
      download,
    })
      .then((res) => {
        if (typeof res == "string") {
          setResponse(res);
        }
      })
      .catch(() => {
        setResponse(undefined);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  type Send = Partial<{
    pathRest: AnyObject;
    params: P;
  }>;

  const send = (
    data:
      | Partial<
          Send & { download?: boolean; fileName?: string; extension: Extension }
        >
      | undefined = {}
  ) => {
    let options:
      | (Send & {
          download?: boolean;
          fileName?: string;
          extension?: Extension;
        })
      | undefined = {};

    if (typeof data === "object" && props !== null && !Array.isArray(props)) {
      const {
        params: dataParams,
        pathRest: dataPathRest,
        download: dataDownload,
        fileName: dataFileName,
        extension: dataExtension,
      } = data as Send & {
        download?: boolean;
        fileName?: string;
        extension?: Extension;
      };

      if (
        dataParams != undefined ||
        dataPathRest != undefined ||
        dataDownload != undefined ||
        dataFileName != undefined ||
        dataExtension != undefined
      ) {
        options = {
          params: (dataParams as P) ?? undefined,
          pathRest: (dataPathRest as AnyObject | undefined) ?? undefined,
          download: dataDownload,
          fileName: dataFileName,
          extension: dataExtension,
        };
      } else {
        options.params = (data as P) ?? undefined;
      }
    }

    request({
      params: options?.params ?? ({} as AnyObject | undefined),
      pathRest: options?.pathRest as AnyObject | undefined,
      download: options?.download,
      fileName: [
        options?.fileName
          ? options?.fileName
          : propsDownload?.defaultName
          ? propsDownload?.defaultName
          : "download",
        options?.extension
          ? typeof options.extension == "string"
            ? options.extension
            : options.extension?.customExtension
          : propsDownload.extension
          ? typeof propsDownload.extension == "string"
            ? propsDownload.extension
            : propsDownload?.extension.customExtension
          : "pdf",
      ],
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
