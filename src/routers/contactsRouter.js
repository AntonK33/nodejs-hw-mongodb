import express from "express";
import {
    getAllContacts,
    getOneContact,
    deleteContact,
    updateContact,
    addContact
} from "../controllers/contactControllers.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import validateBody from "../middelwares/validateBody.js";
import ctrlWrapper from "../middelwares/notFoundHandler.js";
import isValidId from "../middelwares/isValidId.js";

const contactsRouter = express.Router();

contactsRouter.get("/", ctrlWrapper(getAllContacts));

contactsRouter.get("/:id",isValidId, ctrlWrapper(getOneContact));

contactsRouter.post("/",validateBody(createContactSchema), ctrlWrapper(addContact));

contactsRouter.patch("/:id",isValidId,validateBody(updateContactSchema), ctrlWrapper(updateContact));

contactsRouter.delete("/:id",isValidId, ctrlWrapper(deleteContact));





export default contactsRouter;