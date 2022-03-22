import HttpStatus from "http-status-codes";
import BaseError from "interfaces/http/errors/base";

class TooManyRequestsError extends BaseError {
  constructor(
    message = "Too many requests sent in a given amount of time",
    status = HttpStatus.TOO_MANY_REQUESTS,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
  ) {
    super(message, status, data);
    this.name = "TooManyRequestsError";
  }
}

export default TooManyRequestsError;
