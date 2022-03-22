import HttpStatus from "http-status-codes";
import BaseError from "interfaces/http/errors/base";

class RequestTimeoutError extends BaseError {
  constructor(
    message = "The server timed out waiting for the request",
    status = HttpStatus.REQUEST_TIMEOUT,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
  ) {
    super(message, status, data);
    this.name = "RequestTimeoutError";
  }
}

export default RequestTimeoutError;
