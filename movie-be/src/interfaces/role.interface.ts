import { Document, Types } from 'mongoose';

export interface IRole extends Document {
  name: string;
  description?: string;
  permissions: Types.ObjectId[]; // Ref to Permission
  isDefault: boolean;
} 