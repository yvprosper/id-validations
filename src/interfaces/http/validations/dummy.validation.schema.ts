/* eslint-disable import/prefer-default-export */
import BaseJoi from "joi";
import JoiDateExtention from "@hapi/joi-date";
// import moment from "moment";
// let tomorrow = moment().add(24, "hours").format("YYYY-MM-DD");
const Joi = BaseJoi.extend(JoiDateExtention);

// validatioin for creating todo
export const createTodoSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
});
