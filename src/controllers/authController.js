import User from "../models/User.js";
import createHttpError from "http-errors";
import ctrlWrapper from "../middelwares/ctrlWrapper.js";
//import { request } from "express";
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
    
    const avatarURL = gravatar.url(email);
    const body = { ...req.body, password: hashedPassword, avatarURL };

    const newUser = await User.create(body);
     
    res.status(201).json({
        message: "Successfully registered a user!",
        data: {
          name:  newUser.name,
         email:  newUser.email,

        }
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
        
    const { _id: id} = user;
    const payload = { id };

    //const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" }); 
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });

    await authServices.updateUser({ _id: id }, { token: accessToken });

         await Session.findOneAndUpdate(
            { userId: id },
            {
                userId: id,
                accessToken,
                refreshToken,
                accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), 
                refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
            { upsert: true, new: true }
        );

        res.status(200).json({
            status: "success",
            message: "Successfully registered a user!",
               data: {              
                    accessToken,               
                }
    });
    } catch (error) {
        next(error);
    }
    

};

const getCurrent = async (req, res) => {
    const { email } = req.user;
    console.log( email);
    res.json({
        email,
     
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
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            throw createHttpError(401, "Refresh token is required");
        }

        const session = await Session.findOne({ refreshToken });
        if (!session) {
            throw createHttpError(403, "Invalid refresh token");
        }

        await Session.findByIdAndDelete(session._id);

        const payload = { id: session.userId };
        const newAccessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });

        const newSession = new Session({
            userId: session.userId,
            accessToken: newAccessToken,
            refreshToken: session.refreshToken,  // Мы сохраняем тот же refreshToken
            accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 минут
            refreshTokenValidUntil: session.refreshTokenValidUntil, // У нас тот же refreshTokenValidUntil
        });

          res.cookie('refreshToken', session.refreshToken, {
            httpOnly: true,
            // secure: true, 
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        });
        await
            newSession.save();

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