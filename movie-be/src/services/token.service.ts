import jwt, { JwtPayload } from 'jsonwebtoken';
import moment from 'moment';
import httpStatus from 'http-status';
import config from '@/config/config';
import { IUser } from '@/interfaces/user.interface';
import { Token, IToken } from '@/models/token.model';
import { AppError } from '@/utils/AppError';
import { TokenTypes } from '@/config/tokens';

/**
 * Generate a JWT token.
 * @param {string} userId - The user ID.
 *  @param {moment.Moment} expires - The expiration time for the token.
 * @param {TokenTypes} type - The type of the token.
 * @param {string} [secret] - The secret key for signing the token.
 * @returns {string} The generated token.
 */
const generateToken = (
  userId: string,
  expires: moment.Moment,
  type: TokenTypes,
  secret: string = config.jwt.secret
): string => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token to the database.
 * @param {string} token - The token string.
 * @param {string} userId - The ID of the user.
 * @param {moment.Moment} expires - The expiration time of the token.
 * @param {TokenTypes} type - The type of the token.
 * @param {boolean} [blacklisted=false] - Whether the token is blacklisted.
 * @returns {Promise<IToken>} The saved token document.
 */
const saveToken = async (
  token: string,
  userId: string,
  expires: moment.Moment,
  type: TokenTypes,
  blacklisted: boolean = false
) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

/**
 * Generate authentication tokens (access and refresh).
 * @param {IUser} user - The user object.
 * @returns {Promise<object>} An object containing the access and refresh tokens.
 */
const generateAuthTokens = async (user: IUser) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpiresIn, 'seconds');
  const accessToken = generateToken(user.id, accessTokenExpires, TokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpiresIn, 'seconds');
  const refreshToken = generateToken(user.id, refreshTokenExpires, TokenTypes.REFRESH);
  
  await saveToken(refreshToken, user.id, refreshTokenExpires, TokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Verify token and return token doc (if valid).
 * @param {string} token - The token string.
 * @param {TokenTypes} type - The type of the token to verify.
 * @returns {Promise<IToken>} The token document.
 * @throws {AppError} If token is invalid or not found.
 */
const verifyToken = async (token: string, type: TokenTypes): Promise<IToken> => {
  const payload = jwt.verify(token, config.jwt.secret) as JwtPayload;

  if (!payload.sub || payload.type !== type) {
    throw new AppError('Invalid token', httpStatus.UNAUTHORIZED);
  }
  const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
  if (!tokenDoc) {
    throw new AppError('Token not found', httpStatus.NOT_FOUND);
  }
  return tokenDoc;
};

export const tokenService = {
  generateToken,
  generateAuthTokens,
  saveToken,
  verifyToken,
}; 