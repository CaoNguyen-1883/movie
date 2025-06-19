import type { Person } from '@/types/person';
import type { PaginatedResponse } from '@/types/api';
import api from '@/lib/axios';

export const queryPeople = async (params?: any): Promise<PaginatedResponse<Person>> => {
  const response = await api.get('/people', { params });
  return response.data.data;
};

export const getAllPeople = async (): Promise<Person[]> => {
  const response = await api.get('/people', { params: { limit: 0 } });
  return response.data.data.results;
};

export const getPerson = async (personId: string): Promise<Person> => {
  const response = await api.get(`/people/${personId}`);
  return response.data.data;
};

export const createPerson = async (personData: Partial<Person>): Promise<Person> => {
  const response = await api.post('/people', personData);
  return response.data.data;
};

export const updatePerson = async (personId: string, updateData: Partial<Person>): Promise<Person> => {
  const response = await api.patch(`/people/${personId}`, updateData);
  return response.data.data;
};

export const deletePerson = async (personId: string): Promise<void> => {
  await api.delete(`/people/${personId}`);
}; 