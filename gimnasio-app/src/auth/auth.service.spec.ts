import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.enum';
import * as bcrypt from 'bcryptjs';

const mockUser: User = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'John Doe',
  email: 'john@example.com',
  password: '$2a$10$hashedpassword',
  role: Role.MEMBER,
  refreshTokenHash: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUsersService = {
    findByEmail: jest.fn(),
    findOne: jest.fn(),
    saveRefreshToken: jest.fn(),
    clearRefreshToken: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        JWT_ACCESS_SECRET: 'access_secret',
        JWT_REFRESH_SECRET: 'refresh_secret',
        JWT_ACCESS_EXPIRES_IN: '15m',
        JWT_REFRESH_EXPIRES_IN: '7d',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return tokens on successful login', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const userWithPassword = { ...mockUser, password: hashedPassword };

      mockUsersService.findByEmail.mockResolvedValue(userWithPassword);
      mockJwtService.sign
        .mockReturnValueOnce('access_token')
        .mockReturnValueOnce('refresh_token');
      mockUsersService.saveRefreshToken.mockResolvedValue(undefined);

      const result = await service.login('john@example.com', 'password123');

      expect(result).toEqual({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      });
      expect(mockUsersService.saveRefreshToken).toHaveBeenCalled();
    });

    it('should throw error when user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login('notfound@example.com', 'password'),
      ).rejects.toThrow('not_found');
    });

    it('should throw error when password is invalid', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      const userWithPassword = { ...mockUser, password: hashedPassword };

      mockUsersService.findByEmail.mockResolvedValue(userWithPassword);

      await expect(
        service.login('john@example.com', 'wrongpassword'),
      ).rejects.toThrow('invalid_credentials');
    });
  });

  describe('refreshTokens', () => {
    it('should return new tokens on valid refresh token', async () => {
      const refreshToken = 'valid_refresh_token';
      const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
      const userWithToken = { ...mockUser, refreshTokenHash };

      mockJwtService.verify.mockReturnValue({
        sub: mockUser.id,
        email: mockUser.email,
      });
      mockUsersService.findOne.mockResolvedValue(userWithToken);
      mockJwtService.sign
        .mockReturnValueOnce('new_access_token')
        .mockReturnValueOnce('new_refresh_token');
      mockUsersService.saveRefreshToken.mockResolvedValue(undefined);

      const result = await service.refreshTokens(refreshToken);

      expect(result).toEqual({
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
      });
    });

    it('should throw error when refresh token is invalid', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('invalid token');
      });

      await expect(service.refreshTokens('invalid_token')).rejects.toThrow(
        'invalid_token',
      );
    });

    it('should throw error when user has no refresh token hash', async () => {
      const userWithoutToken = { ...mockUser, refreshTokenHash: null };

      mockJwtService.verify.mockReturnValue({
        sub: mockUser.id,
        email: mockUser.email,
      });
      mockUsersService.findOne.mockResolvedValue(userWithoutToken);

      await expect(service.refreshTokens('some_token')).rejects.toThrow(
        'invalid_token',
      );
    });
  });

  describe('logout', () => {
    it('should clear refresh token', async () => {
      mockUsersService.clearRefreshToken.mockResolvedValue(undefined);

      await expect(service.logout(mockUser.id)).resolves.toBeUndefined();
      expect(mockUsersService.clearRefreshToken).toHaveBeenCalledWith(
        mockUser.id,
      );
    });
  });
});
