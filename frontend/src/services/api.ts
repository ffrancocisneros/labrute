import axios, { AxiosInstance, AxiosError } from 'axios';
import { 
  ApiResponse, 
  User, 
  Brute, 
  Skill, 
  Fight, 
  FightResult,
  LoginInput,
  RegisterInput,
  CreateBruteInput 
} from '../types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth state
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (data: LoginInput): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  
  register: async (data: RegisterInput): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  logout: async (): Promise<ApiResponse> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  me: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  verify: async (token: string): Promise<ApiResponse<{ valid: boolean; user?: User }>> => {
    const response = await api.post('/auth/verify', { token });
    return response.data;
  },
};

// Brute API
export const bruteApi = {
  getMyBrutes: async (): Promise<ApiResponse<Brute[]>> => {
    const response = await api.get('/brutes');
    return response.data;
  },
  
  getById: async (id: number): Promise<ApiResponse<Brute>> => {
    const response = await api.get(`/brutes/${id}`);
    return response.data;
  },
  
  getByName: async (name: string): Promise<ApiResponse<Brute>> => {
    const response = await api.get(`/brutes/name/${encodeURIComponent(name)}`);
    return response.data;
  },
  
  create: async (data: CreateBruteInput): Promise<ApiResponse<Brute>> => {
    const response = await api.post('/brutes', data);
    return response.data;
  },
  
  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete(`/brutes/${id}`);
    return response.data;
  },
  
  getOpponents: async (bruteId: number): Promise<ApiResponse<Brute[]>> => {
    const response = await api.get(`/brutes/${bruteId}/opponents`);
    return response.data;
  },
  
  levelUp: async (bruteId: number, statChoice?: string): Promise<ApiResponse<Brute>> => {
    const response = await api.post(`/brutes/${bruteId}/level-up`, { statChoice });
    return response.data;
  },
  
  getLeaderboard: async (limit: number = 10): Promise<ApiResponse<Brute[]>> => {
    const response = await api.get(`/brutes/leaderboard?limit=${limit}`);
    return response.data;
  },
  
  getSkills: async (): Promise<ApiResponse<Skill[]>> => {
    const response = await api.get('/brutes/skills');
    return response.data;
  },
};

// Fight API
export const fightApi = {
  startFight: async (attackerId: number, defenderId: number): Promise<ApiResponse<{ fight: Fight; result: FightResult }>> => {
    const response = await api.post('/fights', { attackerId, defenderId });
    return response.data;
  },
  
  getById: async (id: number): Promise<ApiResponse<Fight>> => {
    const response = await api.get(`/fights/${id}`);
    return response.data;
  },
  
  getByBruteId: async (bruteId: number, limit: number = 10): Promise<ApiResponse<Fight[]>> => {
    const response = await api.get(`/fights/brute/${bruteId}?limit=${limit}`);
    return response.data;
  },
  
  getRecent: async (limit: number = 10): Promise<ApiResponse<Fight[]>> => {
    const response = await api.get(`/fights/recent?limit=${limit}`);
    return response.data;
  },
};

export default api;

