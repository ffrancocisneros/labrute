import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import config from '../config/env';
import { RegisterInput, LoginInput } from '../utils/validation';

const SALT_ROUNDS = 10;

export class AuthService {
  /**
   * Register a new user
   */
  static async register(input: RegisterInput) {
    const { username, email, password } = input;
    
    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    
    if (existingUser) {
      throw new Error('Username already exists');
    }
    
    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      });
      
      if (existingEmail) {
        throw new Error('Email already registered');
      }
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });
    
    // Generate JWT token
    const token = this.generateToken(user.id, user.username);
    
    return { user, token };
  }
  
  /**
   * Login user
   */
  static async login(input: LoginInput) {
    const { username, password } = input;
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { username },
    });
    
    if (!user) {
      throw new Error('Invalid username or password');
    }
    
    if (!user.isActive) {
      throw new Error('Account is disabled');
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValid) {
      throw new Error('Invalid username or password');
    }
    
    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });
    
    // Generate JWT token
    const token = this.generateToken(user.id, user.username);
    
    // Create session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });
    
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    };
  }
  
  /**
   * Logout user (invalidate session)
   */
  static async logout(token: string) {
    await prisma.session.deleteMany({
      where: { token },
    });
  }
  
  /**
   * Verify JWT token
   */
  static verifyToken(token: string): { id: number; username: string } | null {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as {
        id: number;
        username: string;
      };
      return decoded;
    } catch {
      return null;
    }
  }
  
  /**
   * Generate JWT token
   */
  static generateToken(userId: number, username: string): string {
    return jwt.sign(
      { id: userId, username },
      config.jwt.secret,
      { expiresIn: '7d' } // 7 days
    );
  }
  
  /**
   * Get user by ID
   */
  static async getUserById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        lastLogin: true,
        isActive: true,
      },
    });
  }
  
  /**
   * Validate session
   */
  static async validateSession(token: string) {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });
    
    if (!session) {
      return null;
    }
    
    if (session.expiresAt < new Date()) {
      await prisma.session.delete({ where: { id: session.id } });
      return null;
    }
    
    return session.user;
  }
  
  /**
   * Clean expired sessions
   */
  static async cleanExpiredSessions() {
    await prisma.session.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
  }
}

export default AuthService;

