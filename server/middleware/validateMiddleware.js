export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.issues
      .map((issue) => issue.message)
      .join(", ");
    res.status(400);
    return next(new Error(message));
  }

  // Replace req.body with strictly validated & stripped data
  req.body = result.data;
  next();
};