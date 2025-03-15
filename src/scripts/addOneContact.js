
import { writeFile, readFile } from "fs/promises";
import { PATH_DB } from "../constants/contacts.js";
import { nanoid } from "nanoid";
export const addOneContact = async (name, email, job) => {
    let existierteContacts = [];
    const newContact = {
        id: nanoid(),
        name,
        email,
        job
    };
    
    try {     
        const data = await readFile(PATH_DB, "utf-8");
        existierteContacts = JSON.parse(data);       
    } catch (error) {
        console.error("Ошибка чтения файла:", error);
    };

    const updatedContacts = [...existierteContacts, newContact];

    await writeFile(PATH_DB, JSON.stringify(updatedContacts, null, 2), "utf-8");

    return updatedContacts;

};
addOneContact("Lind", "lindusik@gmail.com", "Musor").then(contacts => {
        console.log("Контакты:", contacts);
    });