import { ApiRequest } from "../@types";
import { fetchRequest } from "./fetchRequest";

export const putData = async ({
  url = "",
  endpoint,
  errorFn,
  pathRest,
  params,
  body,
  headers,
  apiName,
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
    methods: "PUT",
  });
};
