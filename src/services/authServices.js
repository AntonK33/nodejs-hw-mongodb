import User from "../models/User.js";
import bcrypt from "bcrypt";
import { randomBytes } from 'crypto';
import { Session } from "../models/Session.js";
import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/index.js";
import createHttpError from "http-errors";
import  jwt  from "jsonwebtoken";
const { JWT_SECRET } = process.env;


export const findUser = filter => User.findOne(filter);


export const signup = async (payload) => {

  const user = await User.findOne({ email: payload.email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }
  
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  
   return User.create({ ...payload, password: hashedPassword });
};


export const login = async(payload) => { 
  const user = await findUser({ email: payload.email });
   if (!user) {
    throw createHttpError(404, 'User not found');
  }

   const isEqual = await bcrypt.compare(payload.password, user.password); 
   if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }
  await Session.deleteOne({ userId: user._id });

    const accessToken = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: "15m", // 15 минут
  });
  const refreshToken = randomBytes(30).toString('base64');

  return await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });


};


export const logoutUser = async (ObjectId) => {
  await Session.deleteOne({ _id: ObjectId });
};


const createSession = (ObjectId, JWT_SECRET) => {
  const accessToken =  jwt.sign({id: ObjectId }, JWT_SECRET, {
    expiresIn: "15m"
  });
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  
  console.log('SessionId:', sessionId, 'RefreshToken:', refreshToken);
  
   const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
   });
  
  if (!session) {
          console.error('Session not found');
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    console.error('Session token expired'); // Подробный лог
    throw createHttpError(401, 'Session token expired');
  }
  
  const newSession = createSession();

  await Session.deleteOne({ _id: sessionId, refreshToken });

  return await Session.create({
    sessionId: session.sessionId,
    ...newSession,
      
  });
};


//export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data, { new: true });
