import ctrlWrapper from '../middelwares/ctrlWrapper.js';
import * as authServices from '../services/authServices.js';
import { THIRTY_DAYS } from '../constants/index.js';
import { getOAuthURL, validateCode } from '../utils/googleOAuth.js';
import createHttpError from 'http-errors';

const signup = async (req, res, next) => {
  try {
    const newUser = await authServices.signup(req.body);

    return res.status(201).json({
      status: 201,
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
      expires: new Date(Date.now() + THIRTY_DAYS),
    });
    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: new Date(Date.now() + THIRTY_DAYS),
    });

    return res.status(200).json({
       status: 200,
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
    const sessionId = req.cookies.sessionId;
    const refreshToken = req.cookies.refreshToken;
    if (!sessionId || !refreshToken) {
      throw createHttpError(400, 'Missing session ID or refresh token');
    }
    if (sessionId) {
      await authServices.logoutUser(sessionId, refreshToken);
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
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
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
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
const requestResetEmailController = async (req, res, next) => {
  try {
    await authServices.requestResetToken(req.body.email);

    return res.status(200).json({
      status: 200,
      message: 'Reset password email was successfully sent!',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;

    if (!sessionId || !refreshToken) {
      throw createHttpError(400, 'Missing session ID or refresh token');
    }

    await authServices.resetPassword(req.body, sessionId, refreshToken);

    return res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

const getOauthUrlController = (req, res, next) => {
  const url = getOAuthURL();

  return res.json({
    status: 200,
    message: 'Successfully get OAuth url',
    data: {
      oauth_url: url,
    },
  });
};

const confirmOAuthController = async (req, res, next) => {
  try {
    const ticket = await validateCode(req.body.code);
    const user = await authServices.loginOrRegister(
      ticket.payload.email,
      ticket.payload.name,
    );
    return res.json({
      data: {
        accessToken: user.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  signout: ctrlWrapper(signout),
  refreshUserSessionController: ctrlWrapper(refreshUserSessionController),
  requestResetEmailController: ctrlWrapper(requestResetEmailController),
  resetPasswordController: ctrlWrapper(resetPasswordController),
  getOauthUrlController: ctrlWrapper(getOauthUrlController),
  confirmOAuthController: ctrlWrapper(confirmOAuthController),
};
