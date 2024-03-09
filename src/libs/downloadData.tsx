import { ApiRequest } from "../@types";
import { fetchDownloadRequest } from "./fetchDownloadRequest";

export const downloadData = async ({
  url = "",
  endpoint,
  errorFn,
  pathRest,
  params,
  headers,
  apiName,
  fileName,
  download,
  methods = "GET",
  onSuccess,
}: Partial<ApiRequest & { download?: boolean }> = {}) => {
  return fetchDownloadRequest({
    url,
    endpoint,
    errorFn,
    pathRest,
    params,
    headers,
    apiName,
    fileName,
    download,
    methods: methods,
    onSuccess,
  });
};
