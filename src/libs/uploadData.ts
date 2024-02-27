import { ApiRequest } from "../@types";
import { fetchUploadRequest } from "./fetchUploadRequest";

export const uploadData = async ({
  url = "",
  endpoint,
  errorFn,
  pathRest,
  params,
  body,
  headers,
  file,
  uploadFileName = "file",
  apiName,
}: Partial<ApiRequest> & { file: File; uploadFileName?: string }) => {
  return fetchUploadRequest({
    url,
    endpoint,
    errorFn,
    pathRest,
    params,
    headers,
    file,
    uploadFileName,
    apiName,
    methods: "POST",
  });
};
