import _pick from "lodash/pick";
import express from "express";
import HTTP_STATUS from "http-status-codes";
import BaseController from "interfaces/http/controllers/BaseController";
import CreateTodo from "app/actions/CreateTodo";
import { ValidatedRequest } from "express-joi-validation";
import GetAllTodo from "app/actions/GetAllTodo";
import { DummyRequestSchema } from "types";

class DummyController extends BaseController {
  createTodo: CreateTodo;

  getAllTodo: GetAllTodo;

  constructor({ createTodo, getAllTodo }: { createTodo: CreateTodo; getAllTodo: GetAllTodo }) {
    super();
    this.createTodo = createTodo;
    this.getAllTodo = getAllTodo;
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns { Promise}
   * @memberof DummyController
   */
  async create(req: ValidatedRequest<DummyRequestSchema>, res: express.Response): Promise<void> {
    const payload = _pick(req.body, ["firstName", "lastName", "email"]);
    const todo = await this.createTodo.execute(payload, req.span);
    // send response
    this.responseManager
      .getResponseHandler(res)
      .onSuccess(todo, "Todo created successfully!", HTTP_STATUS.CREATED);
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns { Promise}
   * @memberof DummyController
   */

  async get(req: express.Request, res: express.Response): Promise<void> {
    const todo = await this.getAllTodo.execute(req.span);
    // send response
    this.responseManager
      .getResponseHandler(res)
      .onSuccess(todo, "Todos fetched successfully!", HTTP_STATUS.OK);
  }
}

export default DummyController;
