import User from "../models/User.js";
import createHttpError from "http-errors";
import ctrlWrapper from "../middelwares/notFoundHandler.js";
import { request } from "express";
import * as authServices from "../services/authServices.js";
import jwt from "jsonwebtoken";
import { Session } from "../models/Session.js";
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


const signin = async (req, res, next) => {
    try {
    const { email, password } = req.body;
    
    const user = await authServices.findUser({ email });
    
    if (!user) {
        throw createHttpError(401, "Email or password is wrong");
        }
        
    const comparePassword = await authServices.validatePassword(password, user.password);
    if (!comparePassword) {
        throw createHttpError(401, "Email or password is wrong");
        }
        
    const { _id: id, subscription } = user;
    const payload = { id };

    //const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" }); // 15 минут
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" }); // 7 дней

    await authServices.updateUser({ _id: id }, { token: accessToken });

         await Session.findOneAndUpdate(
            { userId: id },
            {
                userId: id,
                accessToken,
                refreshToken,
                accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 минут
                refreshTokenValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
            },
            { upsert: true, new: true }
        );

    res.json({
        accessToken,
        refreshToken,
        user: {
            email,
            subscription: subscription || "starter"
        }
    });
    } catch (error) {
        next(error);
    }
    

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

    await Session.findOneAndDelete({ _id });
    await authServices.updateUser({ _id }, { token: null });

    res.json({
        message: "Signout secces"
    });
};

 const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw createHttpError(401, "Refresh token is required");
        }

        const session = await Session.findOne({ refreshToken });
        if (!session) {
            throw createHttpError(403, "Invalid refresh token");
        }

        // Проверяем, не истек ли refreshToken
        if (session.refreshTokenValidUntil < new Date()) {
            throw createHttpError(403, "Refresh token expired, please sign in again");
        }

        // Создаем новый accessToken
        const payload = { id: session.userId };
        const newAccessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });

        // Обновляем сессию
        session.accessToken = newAccessToken;
        session.accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 минут
        await session.save();

        res.json({ accessToken: newAccessToken });

    } catch (error) {
        next(error);
    }
};


export default {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    signout: ctrlWrapper(signout),
    refreshToken: ctrlWrapper(refreshToken),
};