import ctrlWrapper from '../middelwares/ctrlWrapper.js';
import * as authServices from '../services/authServices.js';
import { ONE_DAY } from '../constants/index.js';



const signup = async (req, res, next) => {
  try {
    const newUser = await authServices.signup(req.body);

    return res.status(201).json({
      message: 'Successfully registered a user!',
      data: {
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
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

    return res.status(200).json({
      message: 'Successfully logged in an user!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const signout = async (req, res, next) => {
  try {
    let sessionId = req.cookies.sessionId;
    if (sessionId) {
      await authServices.logoutUser(sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
  
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session.sessionId, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};

const refreshUserSessionController = async (req, res, next) => {
  try {
    const session = await authServices.refreshUsersSession({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });

    setupSession(res, session);

    return res.status(200).json({
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const requestResetEmailController = async (req, res) => {
  await authServices.requestResetToken(req.body.email);
return  res.json({
    message: 'Reset password email was successfully sent!',
    status: 200,
   
  });
};

export const resetPasswordController = async (req, res) => {
  await authServices.resetPassword(req.body);
return  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};




export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  signout: ctrlWrapper(signout),
  refreshUserSessionController: ctrlWrapper(refreshUserSessionController),
  requestResetEmailController: ctrlWrapper(requestResetEmailController),
   resetPasswordController: ctrlWrapper(resetPasswordController),
};
