import createHttpError from 'http-errors';

const validateBody = (schema) => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      console.log('Joi validation error:', error.details);
      return next(createHttpError(400, error.message));
    }
    next();
  };

  return func;
};

export default validateBody;
