export type PathMap = Record<string, string | number | null | undefined>;

export type AnyObject = Record<string, any>;

export type FetchHeaders = Record<string, string>;

export type ApiRequest = {
  url: string;
  endpoint: string;
  pathRest: AnyObject;
  params: AnyObject;
  body: AnyObject;
  headers: FetchHeaders | undefined;
  errorFn: (data: any) => void;
  files: File | File[];
};

export type MethodsRequest = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export type HookRequest = Pick<
  ApiRequest,
  "endpoint" | "headers" | "errorFn" | "url"
>;
export type RequestGet = Pick<ApiRequest, "params" | "pathRest">;

export type UseGet = Partial<
  Pick<HookRequest, "endpoint" | "headers" | "errorFn" | "url">
>;
