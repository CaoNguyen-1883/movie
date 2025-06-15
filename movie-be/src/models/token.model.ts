import mongoose, { Document, Schema } from 'mongoose';
import { TokenTypes } from '@/config/tokens';

export interface IToken extends Document {
  token: string;
  user: mongoose.Schema.Types.ObjectId;
  type: TokenTypes;
  expires: Date;
  blacklisted: boolean;
}

const tokenSchema = new Schema<IToken>({
  token: {
    type: String,
    required: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: [TokenTypes.REFRESH, TokenTypes.RESET_PASSWORD, TokenTypes.VERIFY_EMAIL],
    required: true,
  },
  expires: {
    type: Date,
    required: true,
  },
  blacklisted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export const Token = mongoose.model<IToken>('Token', tokenSchema); 