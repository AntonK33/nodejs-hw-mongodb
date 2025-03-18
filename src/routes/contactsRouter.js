import express from "express";
import { getAllContacts, getOneContact } from "../controllers/contactControllers";
const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

export default contactsRouter;