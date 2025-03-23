import User from "../models/User.js";
import bcrypt from "bcrypt";
//import { Session } from "../models/Session.js";

export const findUser = filter => User.findOne(filter);

export const signup = async data => {
  const hashPassword = await bcrypt.hash(data.password, 10);
  return User.create({ ...data, password: hashPassword });
};

export const validatePassword = (password, hashPassword) => bcrypt.compare(password, hashPassword);

export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data, { new: true });

// export const createSession = async ({ userId, accessToken, refreshToken, accessTokenValidUntil, refreshTokenValidUntil }) => {
//   return Session.create({ userId, accessToken, refreshToken, accessTokenValidUntil, refreshTokenValidUntil });
// };

// export const deleteSession = userId => Session.findOneAndDelete({ userId });