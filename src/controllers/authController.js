import User from "../models/User.js";
import createHttpError from "http-errors";
import ctrlWrapper from "../middelwares/notFoundHandler.js";
import { request } from "express";
import * as authServices from "../services/authServices.js";
import jwt from "jsonwebtoken";


import bcrypt from "bcrypt";
import gravatar from "gravatar";

const { JWT_SECRET } = process.env;



const signup = async (req, res) => {
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });
   
    if (user) {
        throw createHttpError(409, "Email in use");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const subscription = req.body.subscription ?? "starter";
    const avatarURL = gravatar.url(email);
    const body = { ...req.body, password: hashedPassword, subscription, avatarURL };

    const newUser = await User.create(body);
     
    res.json({
        email: newUser.email,
        subscription: newUser.subscription,
    });
};


const signin = async (req, res) => {
    const { email, password } = req.body;
    
    const user = await authServices.findUser({ email });
    
    if (!user) {
        throw createHttpError(401, "Email or password is wrong")
    }
    const comparePassword = await authServices.validatePassword(password, user.password);
    if (!comparePassword) {
        throw createHttpError(401, "Email or password is wrong")
    }
    const { _id: id, subscription } = user;
    const payload = { id }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    
    await authServices.updateUser({ _id: id }, { token });

    res.json({
        token,
        user: {
            email,
            subscription: subscription || starter
        }
    });

};

const getCurrent = async (req, res) => {
    const { subscription, email } = req.user;
    console.log(subscription, email);
    res.json({
        email,
        subscription
    });
};

const signout = async (req, res) => {
    const { _id } = req.user;
    await authServices.updateUser({ _id }, { token: null });

    res.json({
        message: "Signout secces"
    });
};



export default {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    signout: ctrlWrapper(signout),
};