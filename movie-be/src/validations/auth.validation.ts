import Joi from 'joi';
import { password } from '@/validations/custom.validation';

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    username: Joi.string().required().min(3).max(30),
    role: Joi.string().optional().valid('USER', 'MODERATOR', 'ADMIN'),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

// Add other validation schemas here e.g., for logout, refreshToken, etc.

export const authValidation = {
  register,
  login,
  logout,
  refreshTokens,
}; 