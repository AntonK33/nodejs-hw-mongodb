import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { findUser } from "../services/authServices.js";
import { Session } from "../models/Session.js";

const { JWT_SECRET } = process.env;

const authenticate = async (req, _, next) => {
  try {
  console.log('Authorization Header:', req.headers.authorization);
    const { authorization } = req.headers;
  if (!authorization) {
    return next(createHttpError(401, "Not authorized"));
    }
    
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return next(createHttpError(401, "Bearer not found"));
    }
     const session = await Session.findOne({ accessToken: token });
    if (!session) {
      return next(createHttpError(401, "Session not found"));
    }

   
    if (new Date() > new Date(session.accessTokenValidUntil)) {
      return next(createHttpError(401, "Access token expired"));
    }
 
      const { id } = jwt.verify(token, JWT_SECRET);
      
    const user = await findUser({ _id: id });
    if (!user) {
      next(createHttpError(401, "Not authorized"));
      }
      
    if (!user.token) {
      next(createHttpError(401, "User already logout"));
      }
      
    req.user = user;
    next();
 
   
} catch (error) {
    next(createHttpError(401, error.message));
  
}
  
};

export default authenticate;  