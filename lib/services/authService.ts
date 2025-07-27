import { AdminUser, AdminRole, Permission } from '../types/blog';
import * as jose from 'jose';
import { cookies } from 'next/headers';

// Secret key for JWT signing - in production, this should be an environment variable
const JWT_SECRET = typeof TextEncoder !== 'undefined' 
  ? new TextEncoder().encode(process.env.JWT_SECRET || 'nefer-kali-admin-jwt-secret-key')
  : new Uint8Array(0); // Fallback for test environment
const JWT_EXPIRY = '8h'; // Token expiry time

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  message?: string;
  user?: AdminUser;
  token?: string;
}

export class AuthService {
  /**
   * Authenticate admin user with credentials
   */
  static async login(credentials: AuthCredentials): Promise<AuthResult> {
    try {
      // In a real application, this would validate against a database
      // For now, we'll use a mock admin user for demonstration
      if (credentials.email === 'admin@neferkali.com' && credentials.password === 'admin123') {
        const user: AdminUser = {
          id: '1',
          email: 'admin@neferkali.com',
          name: 'Admin User',
          role: AdminRole.SUPER_ADMIN,
          permissions: [
            Permission.CREATE_POST,
            Permission.EDIT_POST,
            Permission.DELETE_POST,
            Permission.PUBLISH_POST,
            Permission.MANAGE_MEDIA
          ],
          lastLoginAt: new Date(),
          createdAt: new Date()
        };

        // Generate JWT token
        const token = await this.generateToken(user);

        return {
          success: true,
          user,
          token
        };
      }

      // Editor account
      if (credentials.email === 'editor@neferkali.com' && credentials.password === 'editor123') {
        const user: AdminUser = {
          id: '2',
          email: 'editor@neferkali.com',
          name: 'Editor User',
          role: AdminRole.EDITOR,
          permissions: [
            Permission.CREATE_POST,
            Permission.EDIT_POST,
            Permission.PUBLISH_POST,
            Permission.MANAGE_MEDIA
          ],
          lastLoginAt: new Date(),
          createdAt: new Date()
        };

        // Generate JWT token
        const token = await this.generateToken(user);

        return {
          success: true,
          user,
          token
        };
      }

      // Author account
      if (credentials.email === 'author@neferkali.com' && credentials.password === 'author123') {
        const user: AdminUser = {
          id: '3',
          email: 'author@neferkali.com',
          name: 'Author User',
          role: AdminRole.AUTHOR,
          permissions: [
            Permission.CREATE_POST,
            Permission.EDIT_POST,
            Permission.MANAGE_MEDIA
          ],
          lastLoginAt: new Date(),
          createdAt: new Date()
        };

        // Generate JWT token
        const token = await this.generateToken(user);

        return {
          success: true,
          user,
          token
        };
      }

      return {
        success: false,
        message: 'Invalid email or password'
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        message: 'Authentication failed'
      };
    }
  }

  /**
   * Generate JWT token for authenticated user
   */
  static async generateToken(user: AdminUser): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: user.permissions
    };

    return await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRY)
      .sign(JWT_SECRET);
  }

  /**
   * Verify JWT token and extract user data
   */
  static async verifyToken(token: string): Promise<AdminUser | null> {
    try {
      const { payload } = await jose.jwtVerify(token, JWT_SECRET);
      
      return {
        id: payload.sub as string,
        email: payload.email as string,
        name: payload.name as string,
        role: payload.role as AdminRole,
        permissions: payload.permissions as Permission[],
        lastLoginAt: new Date(),
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }

  /**
   * Get current authenticated user from cookies
   */
  static async getCurrentUser(): Promise<AdminUser | null> {
    const cookieStore = cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return null;
    }

    return await this.verifyToken(token);
  }

  /**
   * Check if user has specific permission
   */
  static hasPermission(user: AdminUser | null, permission: Permission): boolean {
    if (!user) return false;
    return user.permissions.includes(permission) || user.role === AdminRole.SUPER_ADMIN;
  }
}