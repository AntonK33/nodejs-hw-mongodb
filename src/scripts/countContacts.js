import { writeFile, readFile } from "fs/promises";
import { PATH_DB } from "../constants/contacts.js";


export const countContacts = async () => { 
    let allContacts = [];
    try {
        const data = await readFile(PATH_DB, "utf-8");
      allContacts = JSON.parse(data); 
    } catch (error) {
         console.error("Ошибка чтения файла:", error);
    }

    const countContacts = allContacts.length;

    return countContacts;
};

countContacts().then(contacts => {
        console.log("Контакты:", contacts);
 });

//console.log(await countContacts());
