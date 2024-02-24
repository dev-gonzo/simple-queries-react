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
}: Partial<ApiRequest> = {}) => {

  return fetchRequest({
    url,
    endpoint,
    errorFn,
    pathRest,
    params,
    body,
    headers,
    methods: "PATCH",
  });
};
