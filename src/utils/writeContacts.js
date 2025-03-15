


import { PATH_DB } from "../constants/contacts.js";
import { writeFile, readFile } from "fs/promises";

export const writeContacts = async (updatedContacts) => {
    try {
        // Записываем обновленные контакты в файл
        await writeFile(PATH_DB, JSON.stringify(updatedContacts, null, 2), "utf-8");

        // Читаем и возвращаем обновленные данные для проверки
        const allContacts = await readFile(PATH_DB, "utf-8");
        return JSON.parse(allContacts);
    } catch (error) {
        console.error("Ошибка записи контактов:", error);
        throw error;
    }
};