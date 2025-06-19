import httpStatus from 'http-status';
import User from '@/models/user.model';
import { IUser } from '@/interfaces/user.interface';
import Role from '@/models/role.model';
import { AppError } from '@/utils/AppError';

// Define a more specific type for the update payload
type UserUpdatePayload = Omit<Partial<IUser>, 'roles'> & { roles?: string[] };

/**
 * Create a user (typically by an admin).
 * @param {object} userBody - The user data.
 * @returns {Promise<IUser>}
 */
export const createUser = async (userBody: Partial<IUser>): Promise<IUser> => {
  if (await User.findOne({ email: userBody.email })) {
    throw new AppError('Email already taken', httpStatus.BAD_REQUEST);
  }
  if (await User.findOne({ username: userBody.username })) {
    throw new AppError('Username already taken', httpStatus.BAD_REQUEST);
  }

  // Ensure roles are valid
  if (userBody.roles && userBody.roles.length > 0) {
    const rolesCount = await Role.countDocuments({
      _id: { $in: userBody.roles },
    });
    if (rolesCount !== userBody.roles.length) {
      throw new AppError('One or more roles are invalid', httpStatus.BAD_REQUEST);
    }
  }

  return User.create(userBody);
};

/**
 * Query for users with pagination and search.
 * @param {object} filter - Mongo filter for fields like 'role'.
 * @param {object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: "field:desc"
 * @param {number} [options.limit] - Maximum number of results per page.
 * @param {number} [options.page] - Current page.
 * @param {string} [options.search] - Search term for username or email.
 * @returns {Promise<object>} - Object containing results and pagination info.
 */
export const queryUsers = async (filter: any, options: any) => {
  const { limit = 10, page = 1, sortBy, search } = options;
  const skip = (page - 1) * limit;

  const query: any = { ...filter };

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query.$or = [
      { username: { $regex: searchRegex } },
      { email: { $regex: searchRegex } },
    ];
  }
  
  const [field, order] = sortBy ? sortBy.split(':') : ['createdAt', 'desc'];
  const sort: { [key: string]: 1 | -1 } = { [field]: order === 'desc' ? -1 : 1 };

  const usersPromise = User.find(query)
    .populate({
      path: 'roles',
      populate: { path: 'permissions' },
    })
    .sort(sort)
    .skip(skip)
    .limit(limit);
    
  const totalPromise = User.countDocuments(query);

  const [results, totalResults] = await Promise.all([usersPromise, totalPromise]);

  return {
    results,
    page,
    limit,
    totalPages: Math.ceil(totalResults / limit),
    totalResults,
  };
};

/**
 * Find a user by their ID.
 * @param id The MongoDB ObjectId of the user.
 * @returns {Promise<IUser | null>} The user document or null if not found.
 */
export const findUserById = async (id: string): Promise<IUser | null> => {
  return User.findById(id).populate({
    path: 'roles',
    populate: {
      path: 'permissions',
      model: 'Permission'
    }
  });
};

/**
 * Update user by ID.
 * @param {string} userId - The ID of the user.
 * @param {object} updateBody - The data to update.
 * @returns {Promise<IUser>} The updated user document.
 * @throws {AppError} If user is not found or email/username is already taken.
 */
export const updateUserById = async (userId: string, updateBody: UserUpdatePayload): Promise<IUser> => {
  const user = await findUserById(userId);
  if (!user) {
    throw new AppError('User not found', httpStatus.NOT_FOUND);
  }
  if (updateBody.email && (await User.findOne({ email: updateBody.email, _id: { $ne: userId } }))) {
    throw new AppError('Email already taken', httpStatus.BAD_REQUEST);
  }
  if (updateBody.username && (await User.findOne({ username: updateBody.username, _id: { $ne: userId } }))) {
    throw new AppError('Username already taken', httpStatus.BAD_REQUEST);
  }

  // Check if roles in updateBody are valid
  if (updateBody.roles) {
    const rolesCount = await Role.countDocuments({
      _id: { $in: updateBody.roles },
    });
    if (rolesCount !== updateBody.roles.length) {
      throw new AppError('One or more roles are invalid', httpStatus.BAD_REQUEST);
    }
  }

  Object.assign(user, updateBody);
  await user.save();
  await user.populate({
    path: 'roles',
    populate: {
      path: 'permissions',
      model: 'Permission'
    }
  });
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

export const userService = {
  createUser,
  queryUsers,
  findUserById,
  updateUserById,
  deleteUserById,
};
