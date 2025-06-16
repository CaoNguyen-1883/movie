import { IUser } from '@/interfaces/user.interface';

declare global {
  namespace Express {
    // This tells Passport's User interface to have the same shape as our IUser.
    // By doing this, req.user will be correctly typed across the application.
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface User extends IUser {}

    export interface Request {
      user?: User;
    }
  }
} 