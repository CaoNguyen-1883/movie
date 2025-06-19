import httpStatus from 'http-status';
import Role from '@/models/role.model';
import { IRole } from '@/interfaces/role.interface';
import { AppError } from '@/utils/AppError';

/**
 * Create a new role.
 * @param {Partial<IRole>} roleBody - The data for the new role.
 * @returns {Promise<IRole>} The created role document.
 * @throws {AppError} If role name already exists.
 */
const createRole = async (roleBody: Partial<IRole>): Promise<IRole> => {
  if (await Role.findOne({ name: roleBody.name })) {
    throw new AppError('Role name already exists', httpStatus.CONFLICT);
  }
  return Role.create(roleBody);
};

/**
 * Get all roles.
 * @returns {Promise<IRole[]>} A list of all roles.
 */
const getRoles = async (): Promise<IRole[]> => {
  return Role.find({}).populate('permissions');
};

/**
 * Get a role by its ID.
 * @param {string} id - The role ID.
 * @returns {Promise<IRole | null>} The role document or null.
 */
const getRoleById = async (id: string): Promise<IRole | null> => {
  return Role.findById(id).populate('permissions');
};

/**
 * Update a role by its ID.
 * @param {string} roleId - The ID of the role to update.
 * @param {Partial<IRole>} updateBody - The data to update.
 * @returns {Promise<IRole>} The updated role document.
 * @throws {AppError} If role is not found or name is taken.
 */
const updateRoleById = async (roleId: string, updateBody: Partial<IRole>): Promise<IRole> => {
  const role = await getRoleById(roleId);
  if (!role) {
    throw new AppError('Role not found', httpStatus.NOT_FOUND);
  }
  if (updateBody.name && (await Role.findOne({ name: updateBody.name, _id: { $ne: roleId } }))) {
    throw new AppError('Role name already taken', httpStatus.CONFLICT);
  }
  Object.assign(role, updateBody);
  await role.save();
  return role;
};

/**
 * Delete a role by its ID.
 * @param {string} roleId - The ID of the role to delete.
 * @returns {Promise<IRole>} The deleted role document.
 * @throws {AppError} If role is not found.
 */
const deleteRoleById = async (roleId: string): Promise<IRole> => {
  const role = await getRoleById(roleId);
  if (!role) {
    throw new AppError('Role not found', httpStatus.NOT_FOUND);
  }
  await role.deleteOne();
  return role;
};


export const roleService = {
  createRole,
  getRoles,
  getRoleById,
  updateRoleById,
  deleteRoleById,
}; 