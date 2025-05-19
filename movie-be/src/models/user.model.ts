import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../interfaces/user.interface';

const UserSchema: Schema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    roles: [{
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    }],
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        const password = this.password as string;
        this.password = await bcrypt.hash(password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password as string);
    } catch (error) {
        throw error;
    }
};

export const User = mongoose.model<IUser & Document>('User', UserSchema); 