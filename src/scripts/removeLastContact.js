import { writeFile, readFile } from "fs/promises";
import { PATH_DB } from "../constants/contacts.js";

export const removeLastContact = async () => {
  let newArray = [];


    try {
       const data = await readFile(PATH_DB, "utf-8");
        newArray = JSON.parse(data);    
    } catch (error) {
         console.error("Ошибка чтения файла:", error);
    }

    newArray.splice(-1, 1);
    await writeFile(PATH_DB, JSON.stringify(newArray, null, 2), "utf-8");
    return newArray;
 };

removeLastContact().then(contacts => {
        console.log("Контакты:", contacts);
    });
