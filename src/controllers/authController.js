import User from "../models/User.js";
import createHttpError from "http-errors";
import ctrlWrapper from "../middelwares/ctrlWrapper.js";
//import { request } from "express";
import * as authServices from "../services/authServices.js";
import jwt from "jsonwebtoken";
import { Session } from "../models/Session.js";
import bcrypt from "bcrypt";
import gravatar from "gravatar";
import { ONE_DAY } from "../constants/index.js";

const { JWT_SECRET } = process.env;



const signup = async (req, res) => {

    const newUser = await authServices.signup(req.body);
     
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
           
        const session = await authServices.login(req.body);
            
            res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY),
    });
    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY),
    });

        res.json({
            status: "200",
            message: "Successfully registered a user!",
            data: {    
                   refreshToken: session.refreshToken,
                   accessToken: session.accessToken,
                   sessionId: session._id
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

const signout = async (req, res, next) => {

    try {
         if (req.cookies.userId) {
    await authServices.logoutUser(req.cookies.userId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
    } catch (error) {
          next(error);
    }

};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('userId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};

const refreshUserSessionController = async (req, res, next) => {
    try {
        
         console.log('Cookies:', req.cookies); 
        const session = await authServices.refreshUsersSession({
            userId: req.cookies.userId,
            refreshToken: req.cookies.refreshToken,
        });

        console.log('Session:', session); 
        
        setupSession(res, session);

        res.json({
            status: 200,
            message: 'Successfully refreshed a session!',
            data: {
                accessToken: session.accessToken,
            }
        });
    } catch (error) {
        console.error('Error refreshing session:', error); 
        next(error);
    }
 
};
   

//  const refreshToken = async (req, res, next) => {
//     try {
//         const { refreshToken } = req.cookies;
//         if (!refreshToken) {
//             throw createHttpError(401, "Refresh token is required");
//         }

//         const session = await Session.findOne({ refreshToken });
//         if (!session) {
//             throw createHttpError(403, "Invalid refresh token");
//         }

//         await Session.findByIdAndDelete(session._id);

//         const payload = { id: session.userId };
//         const newAccessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });

//         const newSession = new Session({
//             userId: session.userId,
//             accessToken: newAccessToken,
//             refreshToken: session.refreshToken,  // Мы сохраняем тот же refreshToken
//             accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 минут
//             refreshTokenValidUntil: session.refreshTokenValidUntil, // У нас тот же refreshTokenValidUntil
//         });

//           res.cookie('refreshToken', session.refreshToken, {
//             httpOnly: true,
//             // secure: true, 
//             sameSite: 'Strict',
//             maxAge: 7 * 24 * 60 * 60 * 1000, 
//         });
//         await
//             newSession.save();

//         res.json({ accessToken: newAccessToken });

//     } catch (error) {
//         next(error);
//     }
// };


export default {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    signout: ctrlWrapper(signout),
    refreshUserSessionController: ctrlWrapper(refreshUserSessionController),
};