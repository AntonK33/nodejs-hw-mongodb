import express from "express";
import {
    getAllContacts,
    getOneContact,
    deleteContact,
    updateContact,
    addContact
} from "../controllers/contactControllers.js";
import ctrlWrapper from "../middelwares/notFoundHandler.js";

const contactsRouter = express.Router();

contactsRouter.get("/", ctrlWrapper(getAllContacts));

contactsRouter.get("/:id", ctrlWrapper(getOneContact));

contactsRouter.post("/", ctrlWrapper(addContact));

contactsRouter.patch("/:id", ctrlWrapper(updateContact));

contactsRouter.delete("/:id", ctrlWrapper(deleteContact));





export default contactsRouter;