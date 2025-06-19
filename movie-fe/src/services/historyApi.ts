import axios from 'axios'; // Import the original axios library
import api from '@/lib/axios'; // Import the configured axios instance
import type { History } from '@/types/history';
import type { PaginatedResponse } from '@/types/api';

// Payload for creating/updating a history record
interface UpdateHistoryPayload {
  movieId: string;
  progress?: number;
  isFinished?: boolean;
}

/**
 * Fetches all history records for the logged-in user with pagination.
 */
export const getMyHistory = async (params?: { page?: number, limit?: number }): Promise<PaginatedResponse<History>> => {
  const { data } = await api.get('/history', { params });
  return data.data; // Assuming backend wraps paginated result in a 'data' object
};

export const getMyHistoryForMovie = async (movieId: string): Promise<History> => {
  const response = await api.get(`/history/movie/${movieId}`);
  return response.data.data;
};

/**
 * Fetches the history record for a specific movie for the logged-in user.
 * Returns null if the record doesn't exist (e.g., 404 Not Found).
 */
export const getHistoryForMovie = async (movieId: string): Promise<History | null> => {
  try {
    const { data } = await api.get(`/history/movie/${movieId}`);
    return data.data;
  } catch (error) {
    // It's common for a history record to not exist, so we treat 404 as a non-error case.
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error; // Re-throw any other errors
  }
};

/**
 * Creates or updates a history record for a movie (upsert operation).
 */
export const updateHistory = async (payload: UpdateHistoryPayload): Promise<History> => {
  const { data } = await api.put('/history', payload);
  return data.data;
};

/**
 * Deletes a specific history record by its ID.
 */
export const deleteMyHistory = async (historyId: string): Promise<void> => {
  await api.delete(`/history/${historyId}`);
}; 