import { AuthService } from '../authService';
import { AdminRole, Permission } from '../../types/blog';
import { it } from 'date-fns/locale';
import { it } from 'date-fns/locale';
import { it } from 'date-fns/locale';
import { it } from 'date-fns/locale';
import { describe } from 'node:test';
import { it } from 'date-fns/locale';
import { describe } from 'node:test';
import { it } from 'date-fns/locale';
import { it } from 'date-fns/locale';
import { describe } from 'node:test';
import { it } from 'date-fns/locale';
import { it } from 'date-fns/locale';
import { it } from 'date-fns/locale';
import { it } from 'date-fns/locale';
import { describe } from 'node:test';
import { describe } from 'node:test';

// Mock TextEncoder for Node.js environment
global.TextEncoder = class {
  encode(input) {
    return new Uint8Array(Buffer.from(input));
  }
};

// Mock the jose library
jest.mock('jose', () => ({
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setIssuedAt: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue('mock-jwt-token')
  })),
  jwtVerify: jest.fn().mockImplementation((token) => {
    if (token === 'valid-token') {
      return Promise.resolve({
        payload: {
          sub: '1',
          email: 'admin@neferkali.com',
          name: 'Admin User',
          role: AdminRole.SUPER_ADMIN,
          permissions: [Permission.CREATE_POST]
        }
      });
    }
    return Promise.reject(new Error('Invalid token'));
  })
}));

// Mock the next/headers module
jest.mock('next/headers', () => ({
  cookies: jest.fn().mockReturnValue({
    get: jest.fn().mockImplementation((name) => {
      if (name === 'admin_token') {
        return { value: 'valid-token' };
      }
      return undefined;
    })
  })
}));

describe('AuthService', () => {
  describe('login', () => {
    it('should authenticate valid admin credentials', async () => {
      const result = await AuthService.login({
        email: 'admin@neferkali.com',
        password: 'admin123'
      });

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user?.role).toBe(AdminRole.SUPER_ADMIN);
    });

    it('should authenticate valid editor credentials', async () => {
      const result = await AuthService.login({
        email: 'editor@neferkali.com',
        password: 'editor123'
      });

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user?.role).toBe(AdminRole.EDITOR);
    });

    it('should authenticate valid author credentials', async () => {
      const result = await AuthService.login({
        email: 'author@neferkali.com',
        password: 'author123'
      });

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user?.role).toBe(AdminRole.AUTHOR);
    });

    it('should reject invalid credentials', async () => {
      const result = await AuthService.login({
        email: 'wrong@example.com',
        password: 'wrongpassword'
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid email or password');
      expect(result.user).toBeUndefined();
      expect(result.token).toBeUndefined();
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', async () => {
      const user = await AuthService.verifyToken('valid-token');
      
      expect(user).not.toBeNull();
      expect(user?.id).toBe('1');
      expect(user?.email).toBe('admin@neferkali.com');
    });

    it('should return null for an invalid token', async () => {
      const user = await AuthService.verifyToken('invalid-token');
      
      expect(user).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should get the current user from cookies', async () => {
      const user = await AuthService.getCurrentUser();
      
      expect(user).not.toBeNull();
      expect(user?.id).toBe('1');
    });
  });

  describe('hasPermission', () => {
    it('should return true when user has the permission', () => {
      const user = {
        id: '1',
        email: 'admin@neferkali.com',
        name: 'Admin User',
        role: AdminRole.EDITOR,
        permissions: [Permission.CREATE_POST, Permission.EDIT_POST],
        lastLoginAt: new Date(),
        createdAt: new Date()
      };

      expect(AuthService.hasPermission(user, Permission.CREATE_POST)).toBe(true);
      expect(AuthService.hasPermission(user, Permission.EDIT_POST)).toBe(true);
    });

    it('should return false when user does not have the permission', () => {
      const user = {
        id: '1',
        email: 'admin@neferkali.com',
        name: 'Admin User',
        role: AdminRole.AUTHOR,
        permissions: [Permission.CREATE_POST],
        lastLoginAt: new Date(),
        createdAt: new Date()
      };

      expect(AuthService.hasPermission(user, Permission.DELETE_POST)).toBe(false);
    });

    it('should return true for any permission when user is SUPER_ADMIN', () => {
      const user = {
        id: '1',
        email: 'admin@neferkali.com',
        name: 'Admin User',
        role: AdminRole.SUPER_ADMIN,
        permissions: [],
        lastLoginAt: new Date(),
        createdAt: new Date()
      };

      expect(AuthService.hasPermission(user, Permission.DELETE_POST)).toBe(true);
      expect(AuthService.hasPermission(user, Permission.PUBLISH_POST)).toBe(true);
    });

    it('should return false when user is null', () => {
      expect(AuthService.hasPermission(null, Permission.CREATE_POST)).toBe(false);
    });
  });
});