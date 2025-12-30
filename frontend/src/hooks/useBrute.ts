import { useState, useEffect, useCallback } from 'react';
import { Brute, Skill, CreateBruteInput } from '../types';
import { bruteApi } from '../services/api';

export function useBrute(bruteId?: number) {
  const [brute, setBrute] = useState<Brute | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBrute = useCallback(async () => {
    if (!bruteId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await bruteApi.getById(bruteId);
      if (response.success && response.data) {
        setBrute(response.data);
      } else {
        setError(response.error || 'Failed to load brute');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load brute');
    } finally {
      setLoading(false);
    }
  }, [bruteId]);

  useEffect(() => {
    fetchBrute();
  }, [fetchBrute]);

  return { brute, loading, error, refetch: fetchBrute };
}

export function useMyBrutes() {
  const [brutes, setBrutes] = useState<Brute[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBrutes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bruteApi.getMyBrutes();
      if (response.success && response.data) {
        setBrutes(response.data);
      } else {
        setError(response.error || 'Failed to load brutes');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load brutes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrutes();
  }, [fetchBrutes]);

  const createBrute = async (data: CreateBruteInput) => {
    const response = await bruteApi.create(data);
    if (response.success && response.data) {
      setBrutes(prev => [...prev, response.data!]);
      return response.data;
    }
    throw new Error(response.error || 'Failed to create brute');
  };

  const deleteBrute = async (id: number) => {
    const response = await bruteApi.delete(id);
    if (response.success) {
      setBrutes(prev => prev.filter(b => b.id !== id));
    } else {
      throw new Error(response.error || 'Failed to delete brute');
    }
  };

  return { 
    brutes, 
    loading, 
    error, 
    refetch: fetchBrutes, 
    createBrute, 
    deleteBrute 
  };
}

export function useOpponents(bruteId?: number) {
  const [opponents, setOpponents] = useState<Brute[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOpponents = useCallback(async () => {
    if (!bruteId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await bruteApi.getOpponents(bruteId);
      if (response.success && response.data) {
        setOpponents(response.data);
      } else {
        setError(response.error || 'Failed to load opponents');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load opponents');
    } finally {
      setLoading(false);
    }
  }, [bruteId]);

  useEffect(() => {
    fetchOpponents();
  }, [fetchOpponents]);

  return { opponents, loading, error, refetch: fetchOpponents };
}

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bruteApi.getSkills();
      if (response.success && response.data) {
        setSkills(response.data);
      } else {
        setError(response.error || 'Failed to load skills');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load skills');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  return { skills, loading, error };
}

export function useLeaderboard(limit: number = 10) {
  const [brutes, setBrutes] = useState<Brute[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bruteApi.getLeaderboard(limit);
      if (response.success && response.data) {
        setBrutes(response.data);
      } else {
        setError(response.error || 'Failed to load leaderboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return { brutes, loading, error, refetch: fetchLeaderboard };
}

export default useBrute;

