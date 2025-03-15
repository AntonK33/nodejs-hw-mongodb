import { createFakeContact } from "../utils/createFakeContact.js";
import { writeFile, readFile } from "fs/promises";
import { PATH_DB } from "../constants/contacts.js";
const generateContacts = async (number) => {
    
    try {
        let existierteContacts = [];
        try {
            const data = await readFile(PATH_DB, "utf-8");
            existierteContacts = JSON.parse(data);


        } catch (error) {
             console.warn("Файл пустой или отсутствует, создаем новый.");
        }
       

        const newContacts = Array.from({ length: number },createFakeContact);
    const updatedContacts = [...existierteContacts, ...newContacts];
        
        await writeFile(PATH_DB, JSON.stringify(updatedContacts, null, 2), "utf-8")
 console.log(`✅ Добавлено ${number} контактов. Всего теперь: ${updatedContacts.length}`);
        return updatedContacts;
    } catch (error) {
         console.error("Ошибка при генерации контактов:", error);
        throw error;
    }
};
 

generateContacts(5).then(contacts => {
  console.log("Контакты:", contacts);
});
