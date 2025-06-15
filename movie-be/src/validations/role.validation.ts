import Joi from 'joi';
import { RoleType } from '@/models/role.model';
import { PermissionType } from '@/models/permission.model';

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'valid MongoDB ObjectId');

const createRole = {
  body: Joi.object().keys({
    name: Joi.string().required().valid(...Object.values(RoleType)),
    description: Joi.string().allow(''),
    permissions: Joi.array().items(Joi.string().valid(...Object.values(PermissionType))),
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
      name: Joi.string().valid(...Object.values(RoleType)),
      description: Joi.string().allow(''),
      permissions: Joi.array().items(Joi.string().valid(...Object.values(PermissionType))),
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