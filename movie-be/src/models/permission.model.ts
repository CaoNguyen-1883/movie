import { model, Schema } from 'mongoose';
import { IPermission, PermissionType } from '@/interfaces/permission.interface';

const PermissionSchema = new Schema<IPermission>(
  {
    name: {
      type: String,
      enum: Object.values(PermissionType),
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      virtuals: true,
    },
  },
);

PermissionSchema.index({ name: 1 });

const Permission = model<IPermission>('Permission', PermissionSchema);

export default Permission; 