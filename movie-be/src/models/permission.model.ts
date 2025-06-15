import mongoose, { Document, Schema } from 'mongoose';

export enum PermissionType {
  // User permissions
  CREATE_USER = 'CREATE_USER',
  READ_USER = 'READ_USER',
  UPDATE_USER = 'UPDATE_USER',
  DELETE_USER = 'DELETE_USER',
  
  // Role permissions
  MANAGE_ROLES = 'MANAGE_ROLES',
  
  // Content permissions
  CREATE_CONTENT = 'CREATE_CONTENT',
  READ_CONTENT = 'READ_CONTENT',
  UPDATE_CONTENT = 'UPDATE_CONTENT',
  DELETE_CONTENT = 'DELETE_CONTENT',
  
  // System permissions
  MANAGE_SYSTEM = 'MANAGE_SYSTEM'
}

export interface IPermission extends Document {
  name: PermissionType;
  description: string;
  isActive: boolean;
}

const permissionSchema = new Schema<IPermission>({
  name: {
    type: String,
    enum: Object.values(PermissionType),
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Pre-save middleware to ensure permission name is uppercase
permissionSchema.pre('save', function(next) {
  this.name = this.name.toUpperCase() as PermissionType;
  next();
});

export const Permission = mongoose.model<IPermission>('Permission', permissionSchema); 