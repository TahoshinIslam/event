export default function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal Server Error";
  res.status(status).json({ success: false, message });
}
