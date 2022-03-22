import mongoose from "mongoose";
import runIntransaction from "infra/libs/runInTransaction";
import ResourceNotFoundError from "interfaces/http/errors/ResourceNotFound";
import InvalidPayloadError from "interfaces/http/errors/InvalidPayload";

class BaseRepository {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Collection: mongoose.Model<any>;

  runInTransaction: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mutations: (arg0: mongoose.ClientSession) => Promise<any>): Promise<any>;
  };

  modelName: string;

  /**
   * @constructor
   * @param {*} param
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor({ Model }: { Model: mongoose.Model<any> }) {
    this.Collection = Model;
    this.runInTransaction = runIntransaction;
    this.modelName = this.Collection.modelName;
  }

  // eslint-disable-next-line class-methods-use-this
  generateId() {
    return mongoose.Types.ObjectId().toString();
  }

  validateId(id: string, modelName: string) {
    if (id && !this.isValidId(id)) {
      throw new InvalidPayloadError(`Invalid ${modelName}Id`);
    }
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  isValidId(documentId: string) {
    return mongoose.Types.ObjectId.isValid(documentId);
  }

  async count() {
    return this.Collection.estimatedDocumentCount();
  }

  /* Full list of option - https://mongoosejs.com/docs/api.html#query_Query-setOptions */

  /**
   *
   * @param {*} query
   * @param {*} projection
   * @param {*} options
   * @param {boolean} multiple
   * @returns {}
   * @memberof BaseRepository
   */
  async find(
    query: mongoose.FilterQuery<unknown>,
    projection: unknown,
    options: mongoose.QueryOptions,
    multiple: boolean
  ): Promise<mongoose.Document<[]>> {
    // eslint-disable-next-line no-nested-ternary
    const results = multiple
      ? this.Collection.find(query, projection, options)
      : options.session
      ? this.Collection.findOne(query).session(options.session).select(projection)
      : this.Collection.findOne(query).select(projection);

    return results.exec();
  }

  /**
   *
   * @param {*} documentId
   * @param {*} projection
   * @param {*} options
   * @returns {}
   * @memberof BaseRepository
   */
  async findById(
    documentId: string,
    projection: unknown,
    options: mongoose.QueryOptions
  ): Promise<mongoose.Document> {
    if (!this.isValidId(documentId)) {
      throw new InvalidPayloadError(`Invalid ${this.modelName}Id`);
    }
    const document = options.session
      ? await this.Collection.findById(documentId)
          .session(options.session)
          .select(projection)
          .setOptions(options)
      : await this.Collection.findById(documentId).select(projection).setOptions(options);

    if (!document) {
      throw new ResourceNotFoundError(`${this.modelName} not found`);
    }

    return document;
  }

  /**
   *
   * @param {*} query
   * @param {*} update
   * @param {*} options
   * @returns {}
   * @memberof BaseRepository
   */
  async findOneAndUpdate(
    query: mongoose.FilterQuery<unknown> = { _id: null },
    update: mongoose.UpdateQuery<unknown>,
    options: mongoose.QueryOptions
  ): Promise<mongoose.Document> {
    if (query._id && !this.isValidId(query._id)) {
      throw new InvalidPayloadError(`Invalid ${this.modelName}Id`);
    }
    const document = await this.Collection.findOneAndUpdate(query, update, options);

    if (!document) {
      throw new ResourceNotFoundError(`${this.modelName} not found`);
    }

    return document;
  }

  /**
   *
   * @param {*} body
   * @param {*} session
   * @returns {}
   * @memberof BaseRepository
   */
  async createDoc(body: unknown, session: mongoose.ClientSession): Promise<mongoose.Document> {
    let document = new this.Collection(body);

    document = session ? document.save({ session }) : document.save();

    return document;
  }

  /**
   * Update a document
   * @param {*} query
   * @param {Object} body
   * @param {Object} options
   * @returns {Document}
   * @memberof BaseRepository
   */
  async update(
    query: mongoose.FilterQuery<unknown>,
    update: mongoose.UpdateQuery<unknown>,
    options: mongoose.QueryOptions
  ): Promise<unknown> {
    if (query._id && !this.isValidId(query._id)) {
      throw new InvalidPayloadError(`Invalid ${this.modelName}Id`);
    }
    const document = await this.Collection.updateOne(query, update, options);

    if (!document) {
      throw new ResourceNotFoundError(`${this.modelName} not found`);
    }

    return document;
  }

  /**
   *
   * @param {*} query
   * @param {*} update
   * @param {*} options
   * @returns {Document}
   * @memberof BaseRepository
   */
  async findOneAndDelete(
    query: mongoose.FilterQuery<unknown> = { _id: null },
    options: mongoose.QueryOptions
  ): Promise<mongoose.Document> {
    if (query._id && !this.isValidId(query._id)) {
      throw new InvalidPayloadError(`Invalid ${this.modelName}Id`);
    }
    const document = await this.Collection.findOneAndDelete(query, options);

    if (!document) {
      throw new ResourceNotFoundError(`${this.modelName} not found`);
    }

    return document;
  }
}

export default BaseRepository;
