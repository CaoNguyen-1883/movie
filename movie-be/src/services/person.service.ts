import httpStatus from 'http-status';
import Person from '@/models/person.model';
import { IPerson } from '@/interfaces/person.interface';
import { AppError } from '@/utils/AppError';

/**
 * Create a person
 * @param {IPerson} personBody
 * @returns {Promise<IPerson>}
 */
const createPerson = async (personBody: Partial<IPerson>): Promise<IPerson> => {
  return Person.create(personBody);
};

/**
 * Query for people
 * @returns {Promise<IPerson[]>}
 */
const getPeople = async (): Promise<IPerson[]> => {
  return Person.find();
};

/**
 * Get person by id
 * @param {string} id
 * @returns {Promise<IPerson>}
 */
const getPersonById = async (id: string): Promise<IPerson> => {
  const person = await Person.findById(id);
  if (!person) {
    throw new AppError('Person not found', httpStatus.NOT_FOUND);
  }
  return person;
};

/**
 * Update person by id
 * @param {string} personId
 * @param {Partial<IPerson>} updateBody
 * @returns {Promise<IPerson>}
 */
const updatePersonById = async (personId: string, updateBody: Partial<IPerson>): Promise<IPerson> => {
  const person = await getPersonById(personId);
  Object.assign(person, updateBody);
  await person.save();
  return person;
};

/**
 * Delete person by id
 * @param {string} personId
 * @returns {Promise<IPerson>}
 */
const deletePersonById = async (personId: string): Promise<IPerson> => {
  const person = await getPersonById(personId);
  await person.deleteOne();
  return person;
};

export const personService = {
  createPerson,
  getPeople,
  getPersonById,
  updatePersonById,
  deletePersonById,
}; 