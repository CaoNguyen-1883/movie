import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '@/utils/catchAsync';
import { personService } from '@/services/person.service';
import { pick } from '@/utils/pick';

const createPerson = catchAsync(async (req: Request, res: Response) => {
  const person = await personService.createPerson(req.body);
  res.status(httpStatus.CREATED).send({
    success: true,
    message: 'Person created successfully.',
    data: person,
  });
});

const getPeople = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await personService.queryPeople(filter, options);
  res.send({
    success: true,
    data: result,
  });
});

const getPerson = catchAsync(async (req: Request, res: Response) => {
  const person = await personService.getPersonById(req.params.personId);
  res.send({
    success: true,
    data: person,
  });
});

const updatePerson = catchAsync(async (req: Request, res: Response) => {
  const person = await personService.updatePersonById(req.params.personId, req.body);
  res.send({
    success: true,
    message: 'Person updated successfully.',
    data: person,
  });
});

const deletePerson = catchAsync(async (req: Request, res: Response) => {
  await personService.deletePersonById(req.params.personId);
  res.status(httpStatus.OK).send({
    success: true,
    message: 'Person deleted successfully.',
  });
});

export const personController = {
  createPerson,
  getPeople,
  getPerson,
  updatePerson,
  deletePerson,
}; 