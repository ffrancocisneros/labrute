import { Response } from 'express';
import BruteService from '../services/brute.service';
import { createBruteSchema, updateBruteSchema, idParamSchema, paginationSchema } from '../utils/validation';
import { AuthRequest, ApiResponse } from '../types';

export class BruteController {
  /**
   * POST /api/brutes
   * Create a new brute
   */
  static async create(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
      }
      
      const validatedData = createBruteSchema.parse(req.body);
      const brute = await BruteService.create(req.user.id, validatedData);
      
      const response: ApiResponse = {
        success: true,
        data: brute,
        message: 'Brute created successfully',
      };
      
      res.status(201).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.message || 'Failed to create brute',
      };
      
      res.status(400).json(response);
    }
  }
  
  /**
   * GET /api/brutes
   * Get all brutes for current user
   */
  static async getMyBrutes(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
      }
      
      const brutes = await BruteService.getByUserId(req.user.id);
      
      const response: ApiResponse = {
        success: true,
        data: brutes,
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.message || 'Failed to get brutes',
      };
      
      res.status(500).json(response);
    }
  }
  
  /**
   * GET /api/brutes/:id
   * Get brute by ID
   */
  static async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const brute = await BruteService.getById(id);
      
      if (!brute) {
        return res.status(404).json({
          success: false,
          error: 'Brute not found',
        });
      }
      
      const response: ApiResponse = {
        success: true,
        data: brute,
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.message || 'Failed to get brute',
      };
      
      res.status(400).json(response);
    }
  }
  
  /**
   * GET /api/brutes/name/:name
   * Get brute by name
   */
  static async getByName(req: AuthRequest, res: Response) {
    try {
      const { name } = req.params;
      const brute = await BruteService.getByName(name);
      
      if (!brute) {
        return res.status(404).json({
          success: false,
          error: 'Brute not found',
        });
      }
      
      const response: ApiResponse = {
        success: true,
        data: brute,
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.message || 'Failed to get brute',
      };
      
      res.status(400).json(response);
    }
  }
  
  /**
   * GET /api/brutes/:id/opponents
   * Get potential opponents for a brute
   */
  static async getOpponents(req: AuthRequest, res: Response) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const opponents = await BruteService.getOpponents(id);
      
      const response: ApiResponse = {
        success: true,
        data: opponents,
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.message || 'Failed to get opponents',
      };
      
      res.status(400).json(response);
    }
  }
  
  /**
   * DELETE /api/brutes/:id
   * Delete a brute
   */
  static async delete(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
      }
      
      const { id } = idParamSchema.parse(req.params);
      await BruteService.delete(id, req.user.id);
      
      const response: ApiResponse = {
        success: true,
        message: 'Brute deleted successfully',
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.message || 'Failed to delete brute',
      };
      
      res.status(400).json(response);
    }
  }
  
  /**
   * GET /api/brutes/leaderboard
   * Get top brutes
   */
  static async getLeaderboard(req: AuthRequest, res: Response) {
    try {
      const { limit } = paginationSchema.parse(req.query);
      const brutes = await BruteService.getLeaderboard(limit);
      
      const response: ApiResponse = {
        success: true,
        data: brutes,
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.message || 'Failed to get leaderboard',
      };
      
      res.status(500).json(response);
    }
  }
  
  /**
   * GET /api/skills
   * Get all available skills
   */
  static async getSkills(req: AuthRequest, res: Response) {
    try {
      const skills = await BruteService.getAvailableSkills();
      
      const response: ApiResponse = {
        success: true,
        data: skills,
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.message || 'Failed to get skills',
      };
      
      res.status(500).json(response);
    }
  }
  
  /**
   * POST /api/brutes/:id/level-up
   * Level up a brute
   */
  static async levelUp(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
      }
      
      const { id } = idParamSchema.parse(req.params);
      const { statChoice } = req.body;
      
      // Verify ownership
      const brute = await BruteService.getById(id);
      if (!brute || brute.userId !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to level up this brute',
        });
      }
      
      const updatedBrute = await BruteService.levelUp(id, statChoice);
      
      const response: ApiResponse = {
        success: true,
        data: updatedBrute,
        message: 'Level up successful!',
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.message || 'Failed to level up',
      };
      
      res.status(400).json(response);
    }
  }
}

export default BruteController;

