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
  apiName: string;
  methods: MethodsRequest
  fileName: [string, string];
};

export type MethodsRequest = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type HookRequest = Pick<
  ApiRequest,
  "endpoint" | "headers" | "errorFn" | "url" | "apiName"
>;
export type RequestGet = Pick<ApiRequest, "params" | "pathRest">;

export type UseRequestHook = Partial<
  Pick<HookRequest, "endpoint" | "headers" | "errorFn" | "url" | "apiName">
>;

export type Config = {
  baseUrl: string;
  bearerToken?: string | null;
  headers?: FetchHeaders | undefined;
};

export type SimpleQueriesConfig = Config & {
  APIs?: (Config & { name: string; enableDefaultToken?: boolean })[];
};
