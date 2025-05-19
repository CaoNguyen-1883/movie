import { User } from '../models/user.model';
import { AppException } from '../exceptions/AppException';
import { IUser } from '../interfaces/user.interface';
import { Document } from 'mongoose';

export class UserService {
    async findAll() {
        return User.find()
            .select('-password')
            .populate({
                path: 'roles',
                populate: {
                    path: 'permissions'
                }
            });
    }

    async findById(id: string) {
        const user = await User.findById(id)
            .select('-password')
            .populate({
                path: 'roles',
                populate: {
                    path: 'permissions'
                }
            });

        if (!user) {
            throw new AppException('User not found', 404, 'USER_NOT_FOUND');
        }

        return user;
    }

    async create(userData: Partial<IUser>) {
        const { username, email } = userData;

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            throw new AppException('User already exists', 400, 'USER_EXISTS');
        }

        const user = await User.create(userData) as Document & { _id: string };
        return this.findById(user._id);
    }

    async update(id: string, userData: Partial<IUser>) {
        const user = await User.findById(id);
        if (!user) {
            throw new AppException('User not found', 404, 'USER_NOT_FOUND');
        }

        // Update user fields
        if (userData.username) user.username = userData.username;
        if (userData.email) user.email = userData.email;
        if (userData.fullName) user.fullName = userData.fullName;
        if (userData.roles) user.roles = userData.roles;
        if (typeof userData.isActive === 'boolean') user.isActive = userData.isActive;

        await user.save();

        return this.findById(id);
    }

    async delete(id: string) {
        const user = await User.findById(id);
        
        if (!user) {
            throw new AppException('User not found', 404, 'USER_NOT_FOUND');
        }

        await user.deleteOne();
        return true;
    }
} 