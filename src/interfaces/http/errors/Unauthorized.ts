import HttpStatus from "http-status-codes";
import BaseError from "interfaces/http/errors/base";

class UnauthorizedError extends BaseError {
  constructor(
    message = "Authorization is required to access this API endpoint.",
    status = HttpStatus.UNAUTHORIZED,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any = null
  ) {
    super(message, status, data);
    this.name = "UnauthorizedError";
  }
}

export default UnauthorizedError;
