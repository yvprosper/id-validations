/* eslint-disable import/prefer-default-export */
import BaseJoi from "joi";
import JoiDateExtention from "@hapi/joi-date";

const Joi = BaseJoi.extend(JoiDateExtention);

// Ghana International Passport
export const validateGip = (payload: object) => {
  const schema = Joi.object({
    id: Joi.string()
      .length(8)
      .pattern(/^G([0-9]){7}$/)
      .messages({
        "string.pattern.base":
          "Pattern Mismatch: Passport ID may only contain letter G and 7 other digits ",
      })
      .required(),
  }).unknown();
  return schema.validate(payload);
};

export const validateSsnit = (payload: object) => {
  const schema = Joi.object({
    id: Joi.string()
      .length(13)
      .pattern(/^([A-Z]{1})([0-9]{12})$/)
      .messages({
        "string.pattern.base":
          " Pattern Mismatch: SSNIT may only contain one letter and 12 other digits",
      })
      .required(),
  }).unknown();
  return schema.validate(payload);
};

// Ghana Voters Card
export const validateGdl = (payload: object) => {
  const schema = Joi.object({
    id: Joi.string()
      .length(6)
      .pattern(/^[0-9]{6}$/)
      .messages({ "string.pattern.base": "Driver's License must be a string of 6 digits only" })
      .required(),
  }).unknown();
  return schema.validate(payload);
};

export const validateGvc = (payload: object) => {
  const schema = Joi.object({
    id: Joi.string()
      .length(10)
      .pattern(/^[0-9]{10}$/)
      .messages({ "string.pattern.base": "GVC must be a string of 10 digits" })
      .required(),
  }).unknown();
  return schema.validate(payload);
};

// Test
const { error } = validateGvc({ id: "1234512346" });
if (error) console.log(` ${error.details[0].message}`);
