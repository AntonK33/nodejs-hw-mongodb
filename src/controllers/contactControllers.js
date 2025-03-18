import contactsServices from "../services/contactsServices.js";




export const getAllContacts = async (req, res, next) => {

    try {
        const result = await contactsServices.listContacts();
         res.json(result);
    } catch (error) {
         next(error);
    }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsServices.getContactById(id);
    if (!result) {
     console.error(404, `Contact with id=${id} not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};