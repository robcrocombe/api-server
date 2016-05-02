import log from '../log';

export default function requestLogger(req, res, next) {
  log.info({
    ip: req.ip,
    protocol: req.protocol,
    secure: req.secure,
    method: req.method,
    url: req.originalUrl,
    body: req.body
  }, 'Request received');
  next();
}
