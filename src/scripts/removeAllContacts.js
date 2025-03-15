import { writeFile, readFile } from "fs/promises";
import { PATH_DB } from "../constants/contacts.js";


export const removeAllContacts = async () => { 



     let clearArray = [];
    try {
       await writeFile(PATH_DB, JSON.stringify(clearArray, null, 2), "utf-8");
    } catch (error) {
         console.error("Ошибка чтения файла:", error);
    }

   
    return clearArray;
};


removeAllContacts().then(contacts => {
        console.log("Контакты:", contacts);
 });
