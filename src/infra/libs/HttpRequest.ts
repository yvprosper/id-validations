// Documentation - https://github.com/axios/axios#instance-methods
// eslint-disable-next-line max-classes-per-file
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosStatic,
} from "axios";
// import tracing from "infra/tracer/tracer";

interface ErrorData {
  message: string;
}

class HttpError extends Error {
  status: number;

  statusText: string;

  headers: Record<string, string>;

  config: AxiosRequestConfig;

  data: ErrorData;

  constructor(axiosErrorResponse: AxiosResponse<AxiosError>) {
    // Calling parent constructor of base Error class.
    const { status, statusText, headers, config, data } = axiosErrorResponse;

    super(data.message || "Something happened");

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }

    this.name = "HttpError";
    // Custom debugging information
    this.status = status;
    this.statusText = statusText;
    this.headers = headers;
    this.config = config;
    this.data = data;
  }
}

class HttpRequest {
  axios: AxiosStatic;

  protected readonly instance: AxiosInstance;

  requestOptions: {
    baseURL: string;
    timeout: number; // 5 mins
    headers: Record<string, string>;
  };

  constructor(options = { baseURL: null, timeout: null, headers: null }) {
    const requestOptions = {
      baseURL: options.baseURL,
      timeout: options.timeout || 300000, // 5 mins
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    };
    this.requestOptions = requestOptions;
    this.axios = axios;
    this.instance = this.axios.create(this.requestOptions);
  }

  /**
   *
   * @param {Object} span
   * @returns this
   * @memberof HttpRequest
   */
  setSpan(span: Record<string, unknown>) {
    if (span) {
      const headers = {};
      // const { tracer, opentracing } = tracing;
      // inject trace into headers
      // tracer.inject(span, opentracing.FORMAT_HTTP_HEADERS, headers);
      // add trace header to provided headers
      this.requestOptions.headers = Object.assign(this.requestOptions.headers, headers);
    }

    return this;
  }

  /**
   *
   * @param {Object} headers
   * @returns this
   * @memberof HttpRequest
   */
  addHeaders(headers: object) {
    if (typeof headers === "object" && headers !== null) {
      // add header to provided headers
      this.requestOptions.headers = Object.assign(this.requestOptions.headers, headers);
    }

    return this;
  }

  get request() {
    // Add a request interceptor
    this.instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(new HttpError(error.response));
      }
    );
    // Add a response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data;
      },
      (error: AxiosError) => {
        return Promise.reject(new HttpError(error.response));
      }
    );

    return this.instance;
  }

  getCancelToken() {
    const { CancelToken } = this.axios;
    return CancelToken;
  }
}

export default HttpRequest;
