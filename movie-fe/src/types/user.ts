export interface Permission {
  _id: string;
  name: string;
  description: string;
}

export interface Role {
  _id: string;
  name: string;
  permissions: Permission[];
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: Role;
  isEmailVerified: boolean;
} 