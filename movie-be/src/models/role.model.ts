import mongoose, { Document, Schema } from 'mongoose';

export enum RoleType {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface IRole extends Document {
  name: RoleType;
  description: string;
  permissions: string[];
  isActive: boolean;
}

const roleSchema = new Schema<IRole>({
  name: {
    type: String,
    enum: Object.values(RoleType),
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  permissions: [{
    type: String,
    required: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Pre-save middleware to ensure role name is uppercase
roleSchema.pre('save', function(next) {
  this.name = this.name.toUpperCase() as RoleType;
  next();
});

export const Role = mongoose.model<IRole>('Role', roleSchema); 