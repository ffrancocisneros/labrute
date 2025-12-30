import { Response } from 'express';
import FightService from '../services/fight.service';
import { startFightSchema, idParamSchema, paginationSchema } from '../utils/validation';
import { AuthRequest, ApiResponse } from '../types';
import BruteService from '../services/brute.service';

export class FightController {
  /**
   * POST /api/fights
   * Start a new fight
   */
  static async startFight(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
      }
      
      const { attackerId, defenderId } = startFightSchema.parse(req.body);
      
      // Verify the attacker belongs to the user
      const attacker = await BruteService.getById(attackerId);
      if (!attacker || attacker.userId !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to use this brute as attacker',
        });
      }
      
      // Execute the fight
      const { fight, result } = await FightService.fight(attackerId, defenderId);
      
      const response: ApiResponse = {
        success: true,
        data: {
          fight,
          result,
        },
        message: result.winner === 'attacker' ? 'Victory!' : 'Defeat!',
      };
      
      res.status(201).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.message || 'Failed to start fight',
      };
      
      res.status(400).json(response);
    }
  }
  
  /**
   * GET /api/fights/:id
   * Get fight by ID
   */
  static async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const fight = await FightService.getById(id);
      
      if (!fight) {
        return res.status(404).json({
          success: false,
          error: 'Fight not found',
        });
      }
      
      const response: ApiResponse = {
        success: true,
        data: fight,
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.message || 'Failed to get fight',
      };
      
      res.status(400).json(response);
    }
  }
  
  /**
   * GET /api/fights/brute/:bruteId
   * Get fights for a brute
   */
  static async getByBruteId(req: AuthRequest, res: Response) {
    try {
      const { bruteId } = req.params;
      const { limit } = paginationSchema.parse(req.query);
      
      const fights = await FightService.getByBruteId(parseInt(bruteId, 10), limit);
      
      const response: ApiResponse = {
        success: true,
        data: fights,
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.message || 'Failed to get fights',
      };
      
      res.status(400).json(response);
    }
  }
  
  /**
   * GET /api/fights/recent
   * Get recent fights (global)
   */
  static async getRecent(req: AuthRequest, res: Response) {
    try {
      const { limit } = paginationSchema.parse(req.query);
      const fights = await FightService.getRecentFights(limit);
      
      const response: ApiResponse = {
        success: true,
        data: fights,
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.message || 'Failed to get recent fights',
      };
      
      res.status(500).json(response);
    }
  }
}

export default FightController;

