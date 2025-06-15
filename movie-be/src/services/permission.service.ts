import { Permission, IPermission } from '@/models/permission.model';

/**
 * Get all available permissions.
 * @returns {Promise<IPermission[]>} A list of all permission documents.
 */
const getPermissions = async (): Promise<IPermission[]> => {
  // Assuming permissions are stored in the database.
  // If not, you could return the values from the PermissionType enum.
  return Permission.find({});
};

export const permissionService = {
  getPermissions,
}; 