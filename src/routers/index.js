import { Router } from "express";

import contactsRouter from "./contactsRouter.js";
import usersRouter from "./auth.js";

const router = Router();

router.use("/contactsRouter", contactsRouter);
router.use("/auth", usersRouter);

export default router;