import Joi from 'joi';
import { PermissionType } from '@/interfaces/permission.interface';

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'valid MongoDB ObjectId');

const createRole = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().allow(''),
    permissions: Joi.array().items(objectId),
  }),
};

const getRole = {
  params: Joi.object().keys({
    roleId: objectId.required(),
  }),
};

const updateRole = {
  params: Joi.object().keys({
    roleId: objectId.required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string().allow(''),
      permissions: Joi.array().items(objectId),
    })
    .min(1),
};

const deleteRole = {
  params: Joi.object().keys({
    roleId: objectId.required(),
  }),
};

export const roleValidation = {
  createRole,
  getRole,
  updateRole,
  deleteRole,
}; 