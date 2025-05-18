import mongoose, { Schema, Document } from 'mongoose';
import { IRole } from '../interfaces/role.interface';

const RoleSchema: Schema = new Schema({
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
    permissions: [{
        type: Schema.Types.ObjectId,
        ref: 'Permission',
        required: true
    }]
}, {
    timestamps: true
});

export const Role = mongoose.model<IRole & Document>('Role', RoleSchema); 