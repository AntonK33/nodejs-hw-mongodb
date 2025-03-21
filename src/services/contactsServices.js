
import Contact from "../models/Contact.js";


export function listContacts() {
  return Contact.find({},  "-createdAt -updatedAt");
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
