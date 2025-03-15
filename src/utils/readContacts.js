import { PATH_DB } from '../constants/contacts.js';
import { writeFile, readFile } from "fs/promises";
import path from 'path';

export const readContacts = async (PATH_DB) => {
    const data = readFile(PATH_DB, "utf-8");
    const allContacts = JSON.parse(data);
    console.log(allContacts);
    return JSON.parse(allContacts);
};
