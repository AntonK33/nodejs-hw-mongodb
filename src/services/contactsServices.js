import { writeFile, readFile } from "fs/promises";
import { nanoid } from "nanoid";

import path from 'path';

const contactsPath = path.resolve("constants", "contacts.json");




async function listContacts() {
  const data = await readFile(contactsPath, "utf-8");
  return JSON.parse(data);
}
async function getContactById(contactId) {
  const contacts = await listContacts();
  const result = contacts.find((item) => item.id === contactId);
  return result || null;
}
//
export default {
  listContacts,
  getContactById,
  
};