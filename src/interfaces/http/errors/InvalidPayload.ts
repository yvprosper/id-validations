import HttpStatus from "http-status-codes";
import BaseError from "interfaces/http/errors/base";

class InvalidPayloadError extends BaseError {
  constructor(
    message = "Provided payload is invalid",
    status = HttpStatus.BAD_REQUEST,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any = null
  ) {
    super(message, status, data);
    this.name = "InvalidPayloadError";
  }
}

export default InvalidPayloadError;
