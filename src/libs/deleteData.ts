import { ApiRequest } from "../@types";
import { fetchRequest } from "./fetchRequest";

export const deleteData = async ({
  url = "",
  endpoint,
  errorFn,
  pathRest,
  params,
  body,
  headers,
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
    methods: "DELETE",
    onSuccess,
  });
};
