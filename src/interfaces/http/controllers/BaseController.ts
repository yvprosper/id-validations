import BaseAutoBindedClass from "base/autoBind";
import ResponseManager from "interfaces/http/manager/Response";

class BaseController extends BaseAutoBindedClass {
  responseManager: typeof ResponseManager;

  constructor() {
    super();
    if (new.target === BaseController) {
      throw new TypeError("Cannot construct BaseController instances directly");
    }
    this.responseManager = ResponseManager;
  }
}
export default BaseController;
