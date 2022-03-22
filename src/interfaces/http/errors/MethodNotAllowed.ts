import HttpStatus from "http-status-codes";
import BaseError from "interfaces/http/errors/base";

class MethodNotAllowedError extends BaseError {
  constructor(
    message = "method not allowed",
    status = HttpStatus.METHOD_NOT_ALLOWED,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any = null
  ) {
    super(message, status, data);
    this.name = "MethodNotAllowedError";
  }
}

export default MethodNotAllowedError;
