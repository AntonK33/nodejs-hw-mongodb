import express from "express";
import { getAllContacts, getOneContact } from "../controllers/contactControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("", getAllContacts);

//contactsRouter.get("/:id", getOneContact);

export default contactsRouter;