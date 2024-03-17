import { ApiRequest } from "../@types";
import { fetchRequest } from "./fetchRequest";

export const patchData = async ({
  url = "",
  endpoint,
  errorFn,
  pathRest,
  params,
  body,
  headers,
  apiName,
  onSuccess,
}: Partial<ApiRequest> = {}) => {
  return fetchRequest({
    url,
    endpoint,
    errorFn,
    pathRest,
    params,
    body,
    headers,
    apiName,
    methods: "PATCH",
    onSuccess,
  });
};
