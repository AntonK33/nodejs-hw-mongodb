import Contact from '../models/Contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export async function listContacts({
  page, 
  perPage,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  userId,
}) {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const totalContacts = await Contact.countDocuments({ userId });
  const contacts = await Contact.find({ userId }, '-createdAt -updatedAt')
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();
  const paginationData = calculatePaginationData(totalContacts, perPage, page);
  console.log("что передает листконтакт", paginationData);
  return {
  contacts,
     ...paginationData,
  };
}
export function getContactById(filter) {
  return Contact.findOne(filter);
}
export function addContact(data) {
  return Contact.create(data);
}
export function updateOneContact(filter, data) {
  return Contact.findOneAndUpdate(filter, data, {
    new: true,
    runValidators: true,
  });
}

export function removeContact(filter) {
  return Contact.findOneAndDelete(filter);
}
