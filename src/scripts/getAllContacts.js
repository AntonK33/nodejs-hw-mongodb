import { readContacts } from "../utils/readContacts.js";
import { writeFile, readFile } from "fs/promises";
import { PATH_DB } from "../constants/contacts.js";

export const getAllContacts = async () => {
   
    try {
        // const allContacts = await readContacts();
        const allContacts = await readFile(PATH_DB, "utf-8");
        return JSON.parse(allContacts);
    } catch (error) {
        console.error("Ошибка чтения файла:", error);
         return [];
    }
    
       
 };
getAllContacts().then(contacts => console.log(contacts));;
//console.log(await getAllContacts());
