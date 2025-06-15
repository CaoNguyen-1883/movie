import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import toJSON from './plugins/toJSON.plugin';
import paginate, { IPaginatedModel } from './plugins/paginate.plugin';
import { IRole } from './role.model';

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password?: string;
  avatar?: string;
  authProvider: 'local' | 'google';
  providerId?: string;
  role: IRole['_id'];
  isEmailVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  comparePassword(password: string): Promise<boolean>;
  _id: mongoose.Types.ObjectId;
}

// Extend Mongoose's Model with our custom methods from the paginate plugin
export interface IUserModel extends IPaginatedModel<IUser> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
  isUsernameTaken(username: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
  findByEmailOrUsername(emailOrUsername: string): Promise<IUser | null>;
}

const userSchema = new mongoose.Schema<IUser, IUserModel>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      private: true, // Hides the password from toJSON output
    },
    avatar: {
      type: String,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    providerId: {
      type: String,
      sparse: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Find a user by email or username.
 * Importantly, it also selects the password field which is private by default.
 * @param {string} emailOrUsername - The user's email or username
 * @returns {Promise<IUser>}
 */
userSchema.statics.findByEmailOrUsername = async function (this: IUserModel, emailOrUsername: string): Promise<IUser> {
  return this.findOne({
    $or: [{ email: emailOrUsername.toLowerCase() }, { username: emailOrUsername }],
  }).select('+password');
};

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (this: IUserModel, email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean> {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if username is taken
 * @param {string} username - The user's username
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isUsernameTaken = async function (
  this: IUserModel,
  username: string,
  excludeUserId?: mongoose.Types.ObjectId
): Promise<boolean> {
  const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  const user = this as IUser;
  // If password field is not selected, or user has no local password (e.g. OAuth user), return false
  if (!user.password) {
    return false;
  }
  return bcrypt.compare(password, user.password);
};

userSchema.pre<IUser>('save', async function (next) {
  const user = this;
  if (user.isModified('password') && user.password) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

export const User = mongoose.model<IUser, IUserModel>('User', userSchema); 