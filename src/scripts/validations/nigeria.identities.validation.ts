/* eslint-disable import/prefer-default-export */
import BaseJoi from "joi";
import JoiDateExtention from "@hapi/joi-date";

const Joi = BaseJoi.extend(JoiDateExtention);

export const validateBvn = (payload: string) => {
  const schema = Joi.object({
    id: Joi.string()
      .length(11)
      .pattern(/^[0-9]{11}$/)
      .messages({ "string.pattern.base": "BVN must be (11) digits only." })
      .required(),
  }).unknown();
  return schema.validate(payload);
};

export const validateNin = (payload: string) => {
  const schema = Joi.object({
    id: Joi.string()
      .length(11)
      .pattern(/^[0-9]{11}$/)
      .messages({ "string.pattern.base": "NIN must be (11) digits only." })
      .required(),
  }).unknown();
  return schema.validate(payload);
};

export const validatePvc = (payload: string) => {
  const schema = Joi.object({
    id: Joi.string()
      .length(19)
      .pattern(
        /^([0-9A-Z]{4})([ -])?([0-9A-Z]{4})([ -])?([0-9]{4})([ -])?([0-9]{4})([ -])?([0-9]{3})$/
      )
      .messages({ "string.pattern.base": "PVC must be (19) alphanumeric characters only." })
      .required(),
  }).unknown();
  return schema.validate(payload);
};

// Nigerian International Passport
export const validateNip = (payload: string) => {
  const schema = Joi.object({
    id: Joi.string()
      .length(9)
      .pattern(/^([A-Z]{1})([0-9]{8})$/)
      .messages({ "string.pattern.base": "Passport ID contain one letter and 8 digits" })
      .required(),
  }).unknown();
  return schema.validate(payload);
};

// Nigerian Driver's License
export const validateDl = (payload: string) => {
  const schema = Joi.object({
    id: Joi.string()
      .length(12)
      .pattern(/^([A-Z]{3})([0-9]{5})([A-Z]{2})([0-9]{2})$/)
      .messages({
        "string.pattern.base": "Driver's license must be alphanumeric with 12 characters",
      })
      .required(),
  }).unknown();
  return schema.validate(payload);
};

export const validatePhoneNumber = (payload: string) => {
  const schema = Joi.object({
    id: Joi.string()
      .length(11)
      .pattern(/^[0-9]+$/)
      .messages({ "string.pattern.base": "Phone number must be 11 digits." })
      .required(),
  }).unknown();
  return schema.validate(payload);
};

export const validateAccountNumber = (payload: string) => {
  const schema = Joi.object({
    accountNumber: Joi.string()
      .length(10)
      .pattern(/^[0-9]{10}$/)
      .messages({ "string.pattern.base": "Account number must be 10 digits." })
      .required(),
    bankCode: Joi.string()
      .length(3)
      .pattern(/^[0-9]+$/)
      .messages({ "string.pattern.base": "Bank Code must be 3 digits." })
      .required(),
  }).unknown();
  return schema.validate(payload);
};

// Business Validations
export const validateCac = (payload: string) => {
  const schema = Joi.object({
    value: Joi.string()
      .length(10)
      .pattern(/^RC([0-9]){8}$/)
      .messages({
        "string.pattern.base": "CAC registeration number must contain RC and 8 other digits",
      })
      .required(),
  }).unknown();
  return schema.validate(payload);
};

export const validateTin = (payload: string) => {
  const schema = Joi.object({
    value: Joi.string()
      .length(13)
      .pattern(/^([0-9]{8})[ -]?([0-9]{4})$/)
      .messages({ "string.pattern.base": "TIN must be 12 digits." })
      .required(),
  }).unknown();
  return schema.validate(payload);
};
