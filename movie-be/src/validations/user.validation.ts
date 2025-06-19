import Joi from 'joi';
import { password } from './custom.validation';

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    username: Joi.string().required(),
    role: Joi.string().hex().length(24).required(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      username: Joi.string().min(3),
      role: Joi.string().hex().length(24),
      isActive: Joi.boolean(),
    })
    .min(1),
};

const updateMyProfile = {
  body: Joi.object()
    .keys({
      fullName: Joi.string().min(1).max(100),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
};

export const userValidation = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateMyProfile,
  deleteUser,
}; 