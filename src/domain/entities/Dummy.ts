/**
 *  Class properties becomes `Mongoose virtual`, Class methods becomes 'Mongoose method'
 *  and Class static methods becomes 'mongoose static'
 */
import moment, { MomentInput } from "moment-timezone";

class Dummy {
  createdAt: MomentInput;

  lastModifiedAt: MomentInput;

  constructor() {
    this.createdAt = null;
    this.lastModifiedAt = null;
  }

  // don't remove this
  get _createdAt() {
    if (moment(this.createdAt).isValid()) {
      return moment(this.createdAt).format("YYYY-MM-DDTHH:mm:sssZ");
    }
    return this.createdAt;
  }

  // don't remove this
  get _lastModifiedAt() {
    if (moment(this.lastModifiedAt).isValid()) {
      return moment(this.lastModifiedAt).format("YYYY-MM-DDTHH:mm:sssZ");
    }
    return this.lastModifiedAt;
  }
}

export default Dummy;
