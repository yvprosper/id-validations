import HttpStatus from "http-status-codes";
import BaseError from "interfaces/http/errors/base";

class BadRequestError extends BaseError {
  constructor(
    message = "The request was not properly formatted",
    status = HttpStatus.BAD_REQUEST,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
  ) {
    super(message, status, data);
    this.name = "BadRequestError";
  }
}

export default BadRequestError;
