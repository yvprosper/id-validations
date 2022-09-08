/* eslint-disable import/prefer-default-export */
import BaseJoi from "joi";
import JoiDateExtention from "@hapi/joi-date";

const Joi = BaseJoi.extend(JoiDateExtention);

// Kenyan International Passport
export const validateKip = (payload: string) => {
  const schema = Joi.object({
    id: Joi.string()
      .length(9)
      .pattern(/^([A-Z]{2})([0-9]{7})$/)
      .messages({ "string.pattern.base": "Passport ID must contain two letters and 7 digits" })
      .required(),
  }).unknown();
  return schema.validate(payload);
};

// Kenyan National ID
export const validateKid = (payload: string) => {
  const schema = Joi.object({
    id: Joi.string()
      .length(9)
      .pattern(/^[0-9]{9}$/)
      .messages({ "string.pattern.base": "National ID must be a string of nine digits" })
      .required(),
  }).unknown();
  return schema.validate(payload);
};
