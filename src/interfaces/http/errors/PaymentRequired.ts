import HttpStatus from "http-status-codes";
import BaseError from "interfaces/http/errors/base";

class PaymentRequiredError extends BaseError {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message = "Payment is required", status = HttpStatus.PAYMENT_REQUIRED, data: any) {
    super(message, status, data);
    this.name = "PaymentRequiredError";
  }
}

export default PaymentRequiredError;
