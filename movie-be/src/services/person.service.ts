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
 * Query for people with pagination and search.
 * @param {object} filter - Mongo filter (currently unused, for future extension).
 * @param {object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: "field:desc"
 * @param {number} [options.limit] - Maximum number of results per page.
 * @param {number} [options.page] - Current page.
 * @param {string} [options.name] - Search term for person's name.
 * @returns {Promise<object>} - Object containing results and pagination info.
 */
const queryPeople = async (filter: any, options: any) => {
  const { limit = 10, page = 1, sortBy, name } = options;
  const skip = (page - 1) * limit;

  const query: any = { ...filter };

  if (name) {
    query.name = { $regex: new RegExp(name, 'i') };
  }
  
  const [field, order] = sortBy ? sortBy.split(':') : ['createdAt', 'desc'];
  const sort: { [key: string]: 1 | -1 } = { [field]: order === 'desc' ? -1 : 1 };

  const peoplePromise = Person.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);
    
  const totalPromise = Person.countDocuments(query);

  const [results, totalResults] = await Promise.all([peoplePromise, totalPromise]);

  return {
    results,
    page,
    limit,
    totalPages: Math.ceil(totalResults / limit),
    totalResults,
  };
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
  queryPeople,
  getPersonById,
  updatePersonById,
  deletePersonById,
}; 