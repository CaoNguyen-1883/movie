import type { History } from '@/types/history';
import api from '@/lib/axios';

export const getMyHistory = async (params?: any): Promise<{ results: History[], totalResults: number }> => {
  const response = await api.get('/history', { params });
  return response.data.data;
};

export const getMyHistoryForMovie = async (movieId: string): Promise<History> => {
  const response = await api.get(`/history/movie/${movieId}`);
  return response.data.data;
};

export const updateMyHistory = async (historyData: { movieId: string; progress: number }): Promise<History> => {
  const response = await api.put('/history', historyData);
  return response.data.data;
};

export const deleteMyHistory = async (historyId: string): Promise<void> => {
  await api.delete(`/history/${historyId}`);
}; 