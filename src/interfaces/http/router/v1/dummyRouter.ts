import express from "express";
import { makeInvoker } from "awilix-express";
import MethodNotAllowedHandler from "interfaces/http/middleware/methodNotAllowed";
import catchErrors from "interfaces/http/errors/catchErrors";
import DummyController from "interfaces/http/controllers/DummyController";
import { createTodoSchema } from "interfaces/http/validations/dummy.validation.schema";
import { createValidator, ExpressJoiInstance } from "express-joi-validation";

const validator: ExpressJoiInstance = createValidator({
  passError: true, // NOTE: this tells the module to pass the error along for you
});

const api = makeInvoker(DummyController);
const router = express.Router();
// Remove the @apiIgnore tag when you duplicate this block
/**
   * @apiIgnore
   * @api {post} /todos Create a todo
   * @apiGroup Todos
   * @apiDescription This endpoint creates a todo
   * @apiName CreateTodo
   * @apiPermission create-todo
   * @apiVersion 1.0.0
   * @apiParam {String} subject       subject of todo.
   * @apiParam {String} note          note of todo.
   * @apiSuccessExample Success Response:
   *     HTTP/1.1 201 OK
   *     {
            "success": true,
            "status_code": 201,
            "message": "Todo created successfully!",
            "data": {
                "status": "incomplete",
                "completedAt": null,
                "dueDate": null,
                "isImportant": false,
                "subject": "March Todos",
                "note": "hello",
                "attachements": [],
                "createdAt": "2021-03-30T08:24:27.652Z",
                "lastModifiedAt": "2021-03-30T08:24:27.652Z",
                "id": "6062e03b2b2fb97d46ca74df"
            },
            "links": []
          }
   *
   * @apiParamExample Sample Request:
   *     
   *     {
   *       "subject": "March 24th",
   *       "note": "Goto the beach"
   *     }
   * 
   * @apiHeader {String} authorization Users bearer access token.
   *
   *  @apiUse MyError
  * 
   */

/* '/v1/todos` */
router
  .route("/")
  .get(catchErrors(api("get")))
  .post(validator.body(createTodoSchema), catchErrors(api("create")))
  .all(MethodNotAllowedHandler);

export default router;
