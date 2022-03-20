import HttpStatus from "http-status-codes";
import BaseError from "interfaces/http/errors/base";

class UnprocessableEntityError extends BaseError {
  constructor(
    message = "The request was well-formed but was unable to be followed due to semantic errors",
    status = HttpStatus.UNPROCESSABLE_ENTITY,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
  ) {
    super(message, status, data);
    this.name = "UnprocessableEntityError";
  }
}

export default UnprocessableEntityError;
