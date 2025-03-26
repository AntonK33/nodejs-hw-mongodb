const ctrlWrapper = (ctrl) => {
  return async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (err) {
        console.error("Controller error:", err);
      next(err);
    }
  };
};

export default ctrlWrapper;
