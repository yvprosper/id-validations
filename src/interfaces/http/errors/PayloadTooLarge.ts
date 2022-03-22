import HttpStatus from "http-status-codes";
import BaseError from "interfaces/http/errors/base";

class PayloadTooLargeError extends BaseError {
  constructor(
    message = "The request is larger than the server is willing or able to process",
    status = HttpStatus.REQUEST_TOO_LONG,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
  ) {
    super(message, status, data);
    this.name = "PayloadTooLargeError";
  }
}

export default PayloadTooLargeError;
