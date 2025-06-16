import { model, Schema } from 'mongoose';
import { IPerson } from '@/interfaces/person.interface';

const PersonSchema = new Schema<IPerson>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: Date,
    },
    bio: {
      type: String,
    },
    photoUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Person = model<IPerson>('Person', PersonSchema);
export default Person; 