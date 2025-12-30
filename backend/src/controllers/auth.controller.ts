import { Request, Response } from 'express';
import AuthService from '../services/auth.service';
import { registerSchema, loginSchema } from '../utils/validation';
import { ApiResponse } from '../types';

export class AuthController {
  /**
   * POST /api/auth/register
   */
  static async register(req: Request, res: Response) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await AuthService.register(validatedData);
      
      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Registration successful',
      };
      
      res.status(201).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.message || 'Registration failed',
      };
      
      res.status(400).json(response);
    }
  }
  
  /**
   * POST /api/auth/login
   */
  static async login(req: Request, res: Response) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await AuthService.login(validatedData);
      
      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Login successful',
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.message || 'Login failed',
      };
      
      res.status(401).json(response);
    }
  }
  
  /**
   * POST /api/auth/logout
   */
  static async logout(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (token) {
        await AuthService.logout(token);
      }
      
      const response: ApiResponse = {
        success: true,
        message: 'Logout successful',
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.message || 'Logout failed',
      };
      
      res.status(500).json(response);
    }
  }
  
  /**
   * GET /api/auth/me
   */
  static async me(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'No token provided',
        });
      }
      
      const decoded = AuthService.verifyToken(token);
      
      if (!decoded) {
        return res.status(401).json({
          success: false,
          error: 'Invalid token',
        });
      }
      
      const user = await AuthService.getUserById(decoded.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }
      
      const response: ApiResponse = {
        success: true,
        data: user,
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.message || 'Failed to get user',
      };
      
      res.status(500).json(response);
    }
  }
  
  /**
   * POST /api/auth/verify
   */
  static async verify(req: Request, res: Response) {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'No token provided',
        });
      }
      
      const decoded = AuthService.verifyToken(token);
      
      const response: ApiResponse = {
        success: !!decoded,
        data: decoded ? { valid: true, user: decoded } : { valid: false },
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      res.status(200).json({
        success: true,
        data: { valid: false },
      });
    }
  }
}

export default AuthController;

