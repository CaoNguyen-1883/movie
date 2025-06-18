import type { Person } from '@/types/person';
import api from '@/lib/axios';

export const getPeople = async (params?: any): Promise<{ results: Person[], totalResults: number }> => {
  const response = await api.get('/people', { params });
  return response.data.data;
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