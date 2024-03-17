export type PathMap = Record<string, string | number | null | undefined>;

export type AnyObject = Record<string, any>;

export type FetchHeaders = Record<string, string>;

export type ApiRequest<T = any> = {
  url: string;
  endpoint: string;
  pathRest: AnyObject;
  params: AnyObject;
  body: AnyObject;
  headers: FetchHeaders | undefined;
  errorFn: (data: any) => void;
  files: File | File[];
  apiName: string;
  methods: MethodsRequest;
  fileName: [string, string];
  onSuccess: (data?: T) => void;
};

export type MethodsRequest = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type HookRequest<T> = Pick<
  ApiRequest<T>,
  "endpoint" | "headers" | "errorFn" | "url" | "apiName" | "onSuccess"
>;
export type RequestGet = Pick<ApiRequest, "params" | "pathRest">;

export type UseRequestHook<T = any> = Partial<
  Pick<
    HookRequest<T>,
    "endpoint" | "headers" | "errorFn" | "url" | "apiName" | "onSuccess"
  >
>;

export type Config = {
  baseUrl: string;
  bearerToken?: string | null;
  headers?: FetchHeaders | undefined;
};

export type SimpleQueriesConfig = Config & {
  APIs?: (Config & { name: string; enableDefaultToken?: boolean })[];
};

export type FileExtensions =
  | "pdf"
  | "xml"
  | "doc"
  | "docx"
  | "xls"
  | "xlsx"
  | "ppt"
  | "pptx"
  | "zip"
  | "rar"
  | "jpg"
  | "jpeg"
  | "png"
  | "gif"
  | "mp3"
  | "mp4"
  | "avi";

export type FetchDownload = Partial<
  Omit<ApiRequest, "body" | "files"> & { download: boolean }
>;

export type UseDownloadHook = UseRequestHook & {
  download?: boolean;
  defaultName?: string;
  extension?: Extension;
};

export type Extension = FileExtensions | { customExtension: string };
