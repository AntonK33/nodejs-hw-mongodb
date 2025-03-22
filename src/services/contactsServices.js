
import Contact from "../models/Contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";
import { SORT_ORDER } from "../constants/index.js";


export async function listContacts({ page, perPage,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',}) {
  const limit = perPage;
  const skip = (page - 1) * perPage;

 const totalContacts = await Contact.countDocuments(); // Подсчитываем общее количество контактов
  const contacts = await Contact.find({}, "-createdAt -updatedAt") // Исключаем ненужные поля
    .skip(skip)
    .limit(limit)
     .sort({ [sortBy]: sortOrder })
    .exec();
  const paginationData = calculatePaginationData(totalContacts, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };

 // return Contact.find({},  "-createdAt -updatedAt");
}
export function getContactById(filter) {
  return Contact.findOne(filter);
}
export function addContact(data) {
  return Contact.create(data);
}
export function updateOneContact(filter, data) {
  return Contact.findOneAndUpdate(filter, data, {new: true, runValidators: true});
}

export function removeContact(filter) {
  return Contact.findOneAndDelete(filter);
}
