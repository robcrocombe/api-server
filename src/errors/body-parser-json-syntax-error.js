export default function (error, req, res, next) {
  if (error instanceof SyntaxError) {
    res.status(400).json({ error: 'Invalid JSON in request' });
  } else {
    next();
  }
}
