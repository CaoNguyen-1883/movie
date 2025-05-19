import { User } from '../models/user.model';
import { AppException } from '../exceptions/AppException';
import { ILoginRequest, ILoginResponse, IRefreshTokenResponse, ITokenPayload } from '../interfaces/auth.interface';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export class AuthService {
    private readonly accessTokenSecret: string;
    private readonly refreshTokenSecret: string;
    private readonly accessTokenExpiresIn: number;
    private readonly refreshTokenExpiresIn: number;

    constructor() {
        this.accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'access_secret';
        this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
        this.accessTokenExpiresIn = this.parseTimeToSeconds(process.env.JWT_ACCESS_EXPIRES_IN || '15m');
        this.refreshTokenExpiresIn = this.parseTimeToSeconds(process.env.JWT_REFRESH_EXPIRES_IN || '7d');
    }

    private parseTimeToSeconds(timeStr: string): number {
        const unit = timeStr.slice(-1);
        const value = parseInt(timeStr.slice(0, -1));
        
        switch (unit) {
            case 's': return value;
            case 'm': return value * 60;
            case 'h': return value * 60 * 60;
            case 'd': return value * 24 * 60 * 60;
            default: return 900; // 15 minutes default
        }
    }

    async login(loginData: ILoginRequest): Promise<ILoginResponse> {
        const { email, password } = loginData;

        // Find user by email
        const user = await User.findOne({ email })
            .select('+password')
            .populate({
                path: 'roles',
                populate: {
                    path: 'permissions'
                }
            });

        if (!user) {
            throw new AppException('Invalid email or password', 401, 'INVALID_CREDENTIALS');
        }

        // Check if user is active
        if (!user.isActive) {
            throw new AppException('Account is deactivated', 401, 'ACCOUNT_DEACTIVATED');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new AppException('Invalid email or password', 401, 'INVALID_CREDENTIALS');
        }

        // Generate tokens
        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user);

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Return user data and tokens
        return {
            user: user.toJSON(),
            accessToken,
            refreshToken
        };
    }

    async refreshToken(refreshToken: string): Promise<IRefreshTokenResponse> {
        try {
            // Verify refresh token
            const decoded = jwt.verify(refreshToken, this.refreshTokenSecret) as ITokenPayload;

            // Find user
            const user = await User.findById(decoded.userId);
            if (!user || !user.isActive) {
                throw new AppException('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
            }

            // Generate new access token
            const accessToken = this.generateAccessToken(user);

            return { accessToken };
        } catch (error) {
            throw new AppException('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
        }
    }

    private generateAccessToken(user: any): string {
        const payload: ITokenPayload = {
            userId: user._id.toString(),
            email: user.email,
            roles: user.roles.map((role: any) => role.name)
        };

        const options: SignOptions = {
            expiresIn: this.accessTokenExpiresIn
        };

        return jwt.sign(payload, this.accessTokenSecret, options);
    }

    private generateRefreshToken(user: any): string {
        const payload: ITokenPayload = {
            userId: user._id.toString(),
            email: user.email,
            roles: user.roles.map((role: any) => role.name)
        };

        const options: SignOptions = {
            expiresIn: this.refreshTokenExpiresIn
        };

        return jwt.sign(payload, this.refreshTokenSecret, options);
    }
} 