import mongoose, { Schema, Document } from 'mongoose';
import { IPermission } from '../interfaces/permission.interface';

const PermissionSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    }
}, {
    timestamps: true
});

export const Permission = mongoose.model<IPermission & Document>('Permission', PermissionSchema); 