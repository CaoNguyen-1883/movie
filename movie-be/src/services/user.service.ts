import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { User, IUser } from '@/models/user.model';
import { Role } from '@/models/role.model';
import { AppError } from '@/utils/AppError';
import { RoleType } from '@/models/role.model';
import { IQueryResult } from '@/models/plugins/paginate.plugin';

/**
 * Register a new user with email and password (for public registration).
 * @param {IUser} userBody - The user data.
 * @returns {Promise<IUser>}
 */
export const registerLocalUser = async (userBody: Partial<IUser>): Promise<IUser> => {
  if (await User.isEmailTaken(userBody.email!)) {
    throw new AppError('Email already taken', httpStatus.BAD_REQUEST);
  }
  if (await User.isUsernameTaken(userBody.username!)) {
    throw new AppError('Username already taken', httpStatus.BAD_REQUEST);
  }

  const userRole = await Role.findOne({ name: RoleType.USER });
  if (!userRole) {
    throw new AppError('Default USER role not found. Please run seeders.', httpStatus.INTERNAL_SERVER_ERROR);
  }

  const user = await User.create({
    ...userBody,
    role: userRole._id,
    authProvider: 'local',
  });

  return user;
};

/**
 * Create a user (typically by an admin).
 * @param {object} userBody - The user data, must include a valid 'role' ObjectId.
 * @returns {Promise<IUser>}
 */
export const createUser = async (userBody: Partial<IUser>): Promise<IUser> => {
  if (await User.isEmailTaken(userBody.email!)) {
    throw new AppError('Email already taken', httpStatus.BAD_REQUEST);
  }
  if (await User.isUsernameTaken(userBody.username!)) {
    throw new AppError('Username already taken', httpStatus.BAD_REQUEST);
  }
  
  // Validation should have already ensured this is a valid ObjectId string
  const roleExists = await Role.findById(userBody.role);
  if (!roleExists) {
    throw new AppError('Role not found', httpStatus.BAD_REQUEST);
  }

  const userToCreate = {
    ...userBody,
    authProvider: 'local'
  };

  return User.create(userToCreate);
};

/**
 * Query for users with pagination.
 * @param {object} filter - Mongo filter.
 * @param {object} options - Query options like sortBy, limit, page.
 * @returns {Promise<QueryResult>}
 */
export const queryUsers = async (filter: any, options: any): Promise<IQueryResult<IUser>> => {
  const queryFilter = { ...filter };
  
  // If filtering by role name, convert role name to role ObjectId
  if (queryFilter.role) {
    const roleDoc = await Role.findOne({ name: queryFilter.role });
    // If a role is found, filter by its id. Otherwise, use a non-existent id
    // to ensure no results are returned, which is the expected behavior for a filter.
    queryFilter.role = roleDoc ? roleDoc._id : null;
  }

  const users = await User.paginate(queryFilter, options);
  return users;
};

/**
 * Find a user by their ID.
 * @param id The MongoDB ObjectId of the user.
 * @returns {Promise<IUser | null>} The user document or null if not found.
 */
export const findUserById = async (id: string): Promise<IUser | null> => {
  return User.findById(id);
};

/**
 * Update user by ID.
 * @param {string} userId - The ID of the user.
 * @param {object} updateBody - The data to update.
 * @returns {Promise<IUser>} The updated user document.
 * @throws {AppError} If user is not found or email is already taken.
 */
export const updateUserById = async (userId: string, updateBody: Partial<IUser>): Promise<IUser> => {
  const user = await findUserById(userId);
  if (!user) {
    throw new AppError('User not found', httpStatus.NOT_FOUND);
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, user._id))) {
    throw new AppError('Email already taken', httpStatus.BAD_REQUEST);
  }
  if (updateBody.role) {
    const roleExists = await Role.findById(updateBody.role);
    if (!roleExists) {
      throw new AppError('Role not found', httpStatus.BAD_REQUEST);
    }
  }

  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by ID.
 * @param {string} userId - The ID of the user to delete.
 * @returns {Promise<IUser | null>} The deleted user document.
 * @throws {AppError} If user is not found.
 */
export const deleteUserById = async (userId: string): Promise<IUser | null> => {
  const user = await findUserById(userId);
  if (!user) {
    throw new AppError('User not found', httpStatus.NOT_FOUND);
  }
  await user.deleteOne();
  return user;
};

// You can add more user-related services here, for example:
/*
const queryUsers = async (filter, options) => {
  // Logic for pagination, sorting, and filtering users
};

const updateUser = async (userId, updateBody) => {
  // Logic to update a user
};

const deleteUser = async (userId) => {
  // Logic to delete a user
};
*/

export const userService = {
  registerLocalUser,
  createUser,
  queryUsers,
  findUserById,
  updateUserById,
  deleteUserById,
};
