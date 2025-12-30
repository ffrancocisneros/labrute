import { useState, useCallback } from 'react';
import { Fight, FightResult } from '../types';
import { fightApi } from '../services/api';

export function useFight() {
  const [fight, setFight] = useState<Fight | null>(null);
  const [result, setResult] = useState<FightResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startFight = useCallback(async (attackerId: number, defenderId: number) => {
    setLoading(true);
    setError(null);
    setFight(null);
    setResult(null);
    
    try {
      const response = await fightApi.startFight(attackerId, defenderId);
      if (response.success && response.data) {
        setFight(response.data.fight);
        setResult(response.data.result);
        return response.data;
      } else {
        setError(response.error || 'Failed to start fight');
        throw new Error(response.error || 'Failed to start fight');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to start fight';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFight = useCallback(async (fightId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fightApi.getById(fightId);
      if (response.success && response.data) {
        setFight(response.data);
        // Reconstruct result from fight data
        const fightData = response.data;
        if (fightData.fightLog && fightData.fightLog.length > 0) {
          const lastEntry = fightData.fightLog[fightData.fightLog.length - 1];
          setResult({
            winner: fightData.winnerId === fightData.attackerId ? 'attacker' : 'defender',
            winnerId: fightData.winnerId!,
            loserId: fightData.winnerId === fightData.attackerId ? fightData.defenderId : fightData.attackerId,
            log: fightData.fightLog,
            attackerFinalHealth: lastEntry.attackerHealthAfter,
            defenderFinalHealth: lastEntry.defenderHealthAfter,
            attackerInitialHealth: fightData.attacker?.health || 0,
            defenderInitialHealth: fightData.defender?.health || 0,
            durationHits: fightData.durationHits,
            winnerExpGained: fightData.winnerExpGained,
            loserExpGained: fightData.loserExpGained,
          });
        }
        return response.data;
      } else {
        setError(response.error || 'Failed to load fight');
        throw new Error(response.error || 'Failed to load fight');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to load fight';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setFight(null);
    setResult(null);
    setError(null);
  }, []);

  return { 
    fight, 
    result, 
    loading, 
    error, 
    startFight, 
    loadFight, 
    reset 
  };
}

export function useFightHistory(bruteId?: number) {
  const [fights, setFights] = useState<Fight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFights = useCallback(async () => {
    if (!bruteId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fightApi.getByBruteId(bruteId);
      if (response.success && response.data) {
        setFights(response.data);
      } else {
        setError(response.error || 'Failed to load fight history');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load fight history');
    } finally {
      setLoading(false);
    }
  }, [bruteId]);

  return { fights, loading, error, refetch: fetchFights };
}

export function useRecentFights(limit: number = 10) {
  const [fights, setFights] = useState<Fight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFights = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fightApi.getRecent(limit);
      if (response.success && response.data) {
        setFights(response.data);
      } else {
        setError(response.error || 'Failed to load recent fights');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load recent fights');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  return { fights, loading, error, refetch: fetchFights };
}

export default useFight;

