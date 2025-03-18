import { writeFile, readFile } from "fs/promises";
import { nanoid } from "nanoid";
import Contact from "../models/Contact.js";


async function listContacts(filter = {}, query = {}) {
  return Contact.find(filter, "-createdAt -updatedAt", query);
}
export function getContactById(filter) {
  return Contact.findOne(filter);
}
//
export default {
  listContacts,
  getContactById,
  
};